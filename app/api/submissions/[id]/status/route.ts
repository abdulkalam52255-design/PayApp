import { NextResponse } from 'next/server';
import { createClientServer } from '@/lib/supabase/server';
import { type DbSubmission } from '@/lib/supabase/mappers';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClientServer();
  if (!supabase) {
    // If no Supabase connection, return a 404 or indicate it's not live
    return NextResponse.json({ error: 'No live database connection' }, { status: 503 });
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(params.id)) {
    return NextResponse.json({ error: 'Invalid submission ID format' }, { status: 400 });
  }

  try {
    // Note: User ownership is implicitly validated by Supabase Row Level Security (RLS).
    // If the anonymous key or session token does not own the record, `single()` throws a Not Found error.
    const { data, error } = await supabase
      .from('submissions')
      .select('status, issue_counts, reports(status, unlocked_at)')
      .eq('id', params.id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const report = Array.isArray(data.reports) ? data.reports[0] : data.reports;
    const isUnlocked = report?.unlocked_at != null || report?.status === 'unlocked';

    return NextResponse.json({
      status: data.status,
      criticalCount: data.issue_counts?.critical ?? 0,
      isUnlocked,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
