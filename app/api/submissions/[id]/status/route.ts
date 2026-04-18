import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';
import { type DbSubmission } from '@/lib/supabase/mappers';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!supabase) {
    // If no Supabase connection, return a 404 or indicate it's not live
    return NextResponse.json({ error: 'No live database connection' }, { status: 503 });
  }

  try {
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
