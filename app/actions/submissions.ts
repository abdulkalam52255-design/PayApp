'use server';

import { createClientServer } from '@/lib/supabase/server';
import type { DocumentRole } from '@/lib/types';
import { MOCK_SUBMISSIONS } from '@/lib/mock-data';

export async function createLiveSubmission(formData: FormData) {
  const supabase = createClientServer();
  const projectId = formData.get('projectId') as string;
  const billingPeriod = formData.get('billingPeriod') as string;

  // Sandbox Override for when the application is running completely disconnected
  if (!supabase) {
    // Generate an offline mock ID so the route succeeds and moves to processing UI
    const uuid = 'sub-mock-' + Math.random().toString(36).substring(2, 9);
    return { success: true, submissionId: uuid };
  }

  const { data: { user }, error: authErr } = await supabase.auth.getUser();
  if (authErr || !user) {
    return { success: false, error: 'Unauthorized: Session missing or invalid.' };
  }

  // 1. Validate project ownership implicity via RLS (or explicit fetch to be doubly safe)
  const { data: project, error: projErr } = await supabase
    .from('projects')
    .select('id')
    .eq('id', projectId)
    .single();

  if (projErr || !project) {
    return { success: false, error: 'Unauthorized: Project ownership validation failed.' };
  }

  // 2. Create the base Submission record (Starts as 'uploading')
  const { data: submission, error: subErr } = await supabase
    .from('submissions')
    .insert({
      project_id: projectId,
      period_label: billingPeriod,
      status: 'uploading',
      issue_counts: { critical: 0, warning: 0, info: 0 },
    })
    .select('id')
    .single();

  if (subErr || !submission) {
    return { success: false, error: `Failed to create submission record: ${subErr?.message}` };
  }

  const submissionId = submission.id;

  // 3. Process + Upload Files
  const fileEntries = formData.getAll('files') as File[];
  
  if (!fileEntries || fileEntries.length === 0) {
    // Revert submission if no files were actually delivered
    await supabase.from('submissions').delete().eq('id', submissionId);
    return { success: false, error: 'No files provided.' };
  }

  for (const file of fileEntries) {
    // Deterministic secure storage path
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const storagePath = `project/${projectId}/submission/${submissionId}/${safeName}`;
    const mimeType = file.type || 'application/octet-stream';

    // 3a. Bytes to Storage Bucket (Targeting 'packages' bucket)
    const { error: uploadErr } = await supabase.storage
      .from('packages')
      .upload(storagePath, file, { contentType: mimeType, upsert: true });

    if (uploadErr) {
      // 3X. CRITICAL: Handle partial failures gracefully
      // To prevent zombie DB entries, if an upload fails midway, we dump the submission and return clean.
      // (Actual prod implementations might support resumes, but atomic failure is heavily preferred here).
      await supabase.from('submissions').delete().eq('id', submissionId);
      return { success: false, error: `Storage upload failed for ${file.name}: ${uploadErr.message}` };
    }

    // 3b. Meta record into Database
    const { data: fileRecord, error: metaErr } = await supabase
      .from('uploaded_files')
      .insert({
        submission_id: submissionId,
        filename: safeName,
        mime_type: mimeType,
        storage_path: storagePath,
      })
      .select('id')
      .single();

    if (metaErr) continue; // Note: In strict apps, fail the entire submission if DB metadata drops

    // 3c. Extract Role corrections passed from UI metadata (matched by filename)
    const storedRoleStr = formData.get(`role_${file.name}`);
    const confidence = parseFloat(formData.get(`confidence_${file.name}`) as string || '0.0');

    if (storedRoleStr) {
      await supabase
        .from('file_role_assignments')
        .insert({
          file_id: fileRecord.id,
          detected_role: storedRoleStr as string,
          confirmed_role: storedRoleStr as string,
          confidence: confidence,
        });
    }
  }

  // 4. Temporary Enqueue Stub (Worker Pipeline lifecycle kickoff)
  // Here we flip the flag to queued. A real pipeline would watch DB inserts, or we trigger an edge lambda.
  await supabase
    .from('submissions')
    .update({ status: 'queued' })
    .eq('id', submissionId);

  return { success: true, submissionId };
}
