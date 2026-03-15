// app/dashboard/history/page.tsx

import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { FileSpreadsheet, ChevronRight, TrendingUp, DollarSign } from 'lucide-react';
import { formatCurrency, formatROAS } from '@/lib/utils';

export default async function HistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: uploads } = await supabase
    .from('uploads')
    .select(`
      *,
      analyses (
        id, summary, overall_roas, total_spend, created_at
      )
    `)
    .eq('user_id', user!.id)
    .eq('status', 'completed')
    .order('created_at', { ascending: false })
    .limit(20);

  return (
    <div className="flex-1 p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Analysis History</h1>
        <p className="text-slate-500 mt-1 text-sm">All your previous CSV analyses in one place.</p>
      </div>

      {!uploads || uploads.length === 0 ? (
        <div className="max-w-lg text-center py-20">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <FileSpreadsheet className="w-7 h-7 text-slate-400" />
          </div>
          <p className="text-slate-700 font-semibold mb-2">No analyses yet</p>
          <p className="text-slate-400 text-sm mb-6">Upload your first Meta Ads CSV to see results here.</p>
          <Link
            href="/dashboard"
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Analyze my first CSV
          </Link>
        </div>
      ) : (
        <div className="max-w-3xl space-y-3">
          {uploads.map((upload) => {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
            const analysis = (upload as any).analyses?.[0];

            return (
              <Link
                key={upload.id}
                href={`/dashboard/analysis/${upload.id}`}
                className="flex items-center justify-between bg-white rounded-2xl border border-slate-200 px-6 py-4 card-shadow hover:card-shadow-hover transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{upload.file_name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {new Date(upload.created_at).toLocaleDateString('en-US', {
                        month: 'long', day: 'numeric', year: 'numeric',
                      })}
                    </p>
                    {analysis && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1 max-w-md">
                        {analysis.summary}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-6 text-right flex-shrink-0">
                  {analysis && (
                    <>
                      <div>
                        <div className="flex items-center gap-1 text-emerald-600 font-semibold text-sm">
                          <TrendingUp className="w-3.5 h-3.5" />
                          {formatROAS(analysis.overall_roas || 0)}
                        </div>
                        <p className="text-xs text-slate-400">ROAS</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-slate-700 font-semibold text-sm">
                          <DollarSign className="w-3.5 h-3.5" />
                          {formatCurrency(analysis.total_spend || 0)}
                        </div>
                        <p className="text-xs text-slate-400">Spend</p>
                      </div>
                    </>
                  )}
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}