'use client';

// app/dashboard/page.tsx

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  UploadCloud, FileSpreadsheet, Loader2, AlertCircle,
  CheckCircle2, X, Info,
} from 'lucide-react';
import Papa from 'papaparse';
import { createClient } from '@/lib/supabase/client';
import { formatFileSize } from '@/lib/utils';

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadStage, setUploadStage] = useState('');
  const [rowCount, setRowCount] = useState(0);

  const validateFile = (f: File): string => {
    if (!f.name.endsWith('.csv')) return 'Please upload a CSV file.';
    if (f.size > 10 * 1024 * 1024) return 'File must be under 10 MB.';
    return '';
  };

  const handleFile = useCallback((f: File) => {
    const err = validateFile(f);
    if (err) { setFileError(err); setFile(null); return; }
    setFileError('');
    setFile(f);

    // Quick row count preview
    Papa.parse(f, {
      complete: (results) => setRowCount(results.data.length - 1),
      error: () => {},
    });
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  }, [handleFile]);

  const handleAnalyze = async () => {
    if (!file) return;
    setUploading(true);
    setFileError('');

    try {
      setUploadStage('Reading your CSV...');
      const csvContent = await file.text();

      setUploadStage('Creating upload record...');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: upload, error: uploadErr } = await supabase
        .from('uploads')
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_size_bytes: file.size,
          row_count: rowCount,
          status: 'processing',
        })
        .select()
        .single();

      if (uploadErr) throw uploadErr;

      setUploadStage('Running AI analysis (this takes ~30 seconds)...');
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uploadId: upload.id,
          csvContent,
          fileName: file.name,
        }),
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Analysis failed');

      router.push(`/dashboard/analysis/${upload.id}`);
    } catch (err: unknown) {
      setFileError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
      setUploading(false);
      setUploadStage('');
    }
  };

  return (
    <div className="flex-1 p-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">New Analysis</h1>
        <p className="text-slate-500 mt-1 text-sm">
          Upload your Meta Ads Manager CSV export to get started.
        </p>
      </div>

      {/* Upload zone */}
      <div className="max-w-2xl">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={onDrop}
          onClick={() => !file && fileInputRef.current?.click()}
          className={`relative rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
            dragActive
              ? 'border-indigo-400 bg-indigo-50'
              : file
              ? 'border-emerald-300 bg-emerald-50 cursor-default'
              : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/30'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />

          <div className="p-12 text-center">
            {file ? (
              // File selected state
              <div>
                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileSpreadsheet className="w-7 h-7 text-emerald-600" />
                </div>
                <p className="font-semibold text-slate-900 mb-1">{file.name}</p>
                <p className="text-sm text-slate-500 mb-1">{formatFileSize(file.size)}</p>
                {rowCount > 0 && (
                  <p className="text-sm text-emerald-600 font-medium">{rowCount.toLocaleString()} rows detected</p>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); setFile(null); setRowCount(0); }}
                  className="mt-3 text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 mx-auto"
                >
                  <X className="w-3 h-3" /> Remove file
                </button>
              </div>
            ) : (
              // Empty state
              <div>
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <UploadCloud className="w-7 h-7 text-slate-400" />
                </div>
                <p className="font-semibold text-slate-700 mb-1">Drop your CSV here</p>
                <p className="text-sm text-slate-400 mb-4">or click to browse your files</p>
                <span className="bg-slate-100 text-slate-600 text-xs px-3 py-1.5 rounded-full font-medium">
                  .CSV files up to 10 MB
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Error */}
        {fileError && (
          <div className="mt-3 flex items-start gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{fileError}</span>
          </div>
        )}

        {/* How to export tip */}
        <div className="mt-4 flex items-start gap-3 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3.5">
          <Info className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-indigo-700">
            <strong>How to export:</strong> In Meta Ads Manager, click <em>Export</em> → <em>Export Table Data (CSV)</em>. Make sure "Ad Set" or "Ad" level is selected for best results.
          </div>
        </div>

        {/* Analyze button */}
        {file && !uploading && (
          <button
            onClick={handleAnalyze}
            className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-indigo-100 hover:shadow-indigo-200 hover:-translate-y-0.5"
          >
            ✨ Analyze my ads
          </button>
        )}

        {/* Loading state */}
        {uploading && (
          <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-6 card-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">Analyzing your ads...</p>
                <p className="text-xs text-slate-500 mt-0.5">{uploadStage}</p>
              </div>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full animate-pulse" style={{ width: '60%' }} />
            </div>
          </div>
        )}
      </div>

      {/* Previous analyses hint */}
      <div className="mt-12 max-w-2xl">
        <h2 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">Recent Analyses</h2>
        <RecentAnalyses />
      </div>
    </div>
  );
}

// ─── Recent analyses list ──────────────────────────────────────────────────────

import { useEffect } from 'react';
import type { Upload } from '@/types';

function RecentAnalyses() {
  const supabase = createClient();
  const router = useRouter();
  const [uploads, setUploads] = useState<Upload[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('uploads')
        .select('*')
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(5);
      if (data) setUploads(data);
    })();
  }, [supabase]);

  if (uploads.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
        <p className="text-slate-400 text-sm">No analyses yet. Upload your first CSV above!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden card-shadow">
      {uploads.map((upload, i) => (
        <button
          key={upload.id}
          onClick={() => router.push(`/dashboard/analysis/${upload.id}`)}
          className={`w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors text-left ${
            i > 0 ? 'border-t border-slate-100' : ''
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">{upload.file_name}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {new Date(upload.created_at).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric',
                })}
                {upload.row_count && ` · ${upload.row_count} rows`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-medium">
              Complete
            </span>
            <ChevronRight className="w-4 h-4 text-slate-300" />
          </div>
        </button>
      ))}
    </div>
  );
}

import { ChevronRight } from 'lucide-react';