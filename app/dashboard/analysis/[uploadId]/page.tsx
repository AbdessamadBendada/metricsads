'use client';

// app/dashboard/analysis/[uploadId]/page.tsx

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  TrendingUp, TrendingDown, Sparkles, Send, Loader2,
  ArrowLeft, Target, DollarSign, MousePointerClick,
  Eye, ShoppingCart, BarChart3, AlertCircle, MessageSquare, X
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Analysis, Upload, ChatMessage } from '@/types';
import {
  formatCurrency, formatPercent, formatROAS, formatNumber,
  getStatusColor, getPriorityColor,
} from '@/lib/utils';

export default function AnalysisPage() {
  const { uploadId } = useParams<{ uploadId: string }>();
  const router = useRouter();
  const supabase = createClient();

  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [upload, setUpload] = useState<Upload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const [uploadRes, analysisRes, chatRes] = await Promise.all([
        supabase.from('uploads').select('*').eq('id', uploadId).single(),
        supabase.from('analyses').select('*').eq('upload_id', uploadId).single(),
        supabase.from('chat_messages').select('*').eq('upload_id', uploadId).order('created_at'),
      ]);

      if (uploadRes.error || !uploadRes.data) { setError('Upload not found.'); setLoading(false); return; }
      if (analysisRes.error || !analysisRes.data) { setError('Analysis not found.'); setLoading(false); return; }

      setUpload(uploadRes.data);
      setAnalysis(analysisRes.data);
      setChatMessages(chatRes.data || []);
      setLoading(false);
    })();
  }, [uploadId, supabase]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const sendChatMessage = async () => {
    if (!chatInput.trim() || chatLoading || !analysis) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      upload_id: uploadId,
      user_id: '',
      role: 'user',
      content: chatInput,
      created_at: new Date().toISOString(),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);

    const history = chatMessages.slice(-10).map((m) => ({ role: m.role, content: m.content }));
    const csvSummary = `File: ${upload?.file_name}. Total spend: ${formatCurrency(analysis.total_spend || 0)}. ROAS: ${formatROAS(analysis.overall_roas || 0)}. Top performer: ${analysis.top_performer_name}. Worst performer: ${analysis.worst_performer_name}. Summary: ${analysis.summary}`;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uploadId, message: chatInput, history, csvSummary }),
      });
      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        upload_id: uploadId,
        user_id: '',
        role: 'assistant',
        content: data.reply || 'Sorry, I had trouble responding.',
        created_at: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), upload_id: uploadId, user_id: '', role: 'assistant', content: 'Sorry, something went wrong. Please try again.', created_at: new Date().toISOString() },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-slate-700 font-medium">{error || 'Analysis not found.'}</p>
          <button onClick={() => router.push('/dashboard')} className="mt-4 text-indigo-600 text-sm font-medium hover:text-indigo-700">
            ← Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  const SUGGESTED_QUESTIONS = [
    'Why is my CPC so high?',
    'Which ad should I scale first?',
    'How can I lower my cost per purchase?',
    'What audience is performing best?',
  ];

  return (
<div className="flex-1">
      {/* Main content */}
  <div className="p-8">
        {/* Back + header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{upload?.file_name}</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Analyzed {new Date(analysis.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* Summary */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 text-indigo-700 font-semibold text-sm mb-3">
            <Sparkles className="w-4 h-4" />
            The Bottom Line
          </div>
          <p className="text-slate-700 leading-relaxed">{analysis.summary}</p>
        </div>

        {/* KPI bar */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {[
            { icon: DollarSign, label: 'Total Spend', value: formatCurrency(analysis.total_spend || 0), color: 'text-slate-700' },
            { icon: BarChart3, label: 'Overall ROAS', value: formatROAS(analysis.overall_roas || 0), color: analysis.overall_roas && analysis.overall_roas >= 2 ? 'text-emerald-600' : 'text-red-600' },
            { icon: MousePointerClick, label: 'Avg. CPC', value: formatCurrency(analysis.avg_cpc || 0), color: 'text-slate-700' },
            { icon: Eye, label: 'Impressions', value: formatNumber(analysis.total_impressions || 0), color: 'text-slate-700' },
            { icon: ShoppingCart, label: 'Conversions', value: formatNumber(analysis.total_conversions || 0), color: 'text-slate-700' },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-white rounded-xl p-4 border border-slate-200 card-shadow">
              <div className="flex items-center gap-1.5 mb-2">
                <kpi.icon className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs text-slate-500">{kpi.label}</span>
              </div>
              <div className={`text-xl font-bold ${kpi.color}`}>{kpi.value}</div>
            </div>
          ))}
        </div>

        {/* Winner / Loser */}
        <div className="grid md:grid-cols-2 gap-5 mb-6">
          <div className="bg-white rounded-2xl border border-emerald-200 p-6 card-shadow">
            <div className="flex items-center gap-2 text-emerald-700 font-semibold text-sm mb-3">
              <TrendingUp className="w-4 h-4" />
              🏆 Top Performer
            </div>
            <p className="font-semibold text-slate-900 mb-1.5">{analysis.top_performer_name}</p>
            <p className="text-sm text-slate-500 mb-4">{analysis.top_performer_reason}</p>
            {analysis.top_performer_metrics && (
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(analysis.top_performer_metrics).map(([key, val]) => (
                  <div key={key} className="bg-emerald-50 rounded-lg p-2.5 text-center">
                    <div className="font-bold text-emerald-700 text-sm">
                      {key === 'spend' ? formatCurrency(Number(val)) : key === 'roas' ? formatROAS(Number(val)) : key === 'ctr' ? formatPercent(Number(val)) : key === 'cpc' ? formatCurrency(Number(val)) : String(val)}
                    </div>
                    <div className="text-xs text-slate-500 capitalize">{key}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-red-200 p-6 card-shadow">
            <div className="flex items-center gap-2 text-red-700 font-semibold text-sm mb-3">
              <TrendingDown className="w-4 h-4" />
              ⚠️ Needs Attention
            </div>
            <p className="font-semibold text-slate-900 mb-1.5">{analysis.worst_performer_name}</p>
            <p className="text-sm text-slate-500 mb-4">{analysis.worst_performer_reason}</p>
            {analysis.worst_performer_metrics && (
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(analysis.worst_performer_metrics).map(([key, val]) => (
                  <div key={key} className="bg-red-50 rounded-lg p-2.5 text-center">
                    <div className="font-bold text-red-700 text-sm">
                      {key === 'spend' ? formatCurrency(Number(val)) : key === 'roas' ? formatROAS(Number(val)) : key === 'ctr' ? formatPercent(Number(val)) : key === 'cpc' ? formatCurrency(Number(val)) : String(val)}
                    </div>
                    <div className="text-xs text-slate-500 capitalize">{key}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action plan */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 card-shadow">
          <div className="flex items-center gap-2 font-semibold text-slate-900 mb-5">
            <Target className="w-4 h-4 text-indigo-600" />
            Your Action Plan
          </div>
          <div className="space-y-3">
            {analysis.action_items.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex-shrink-0 mt-0.5 capitalize ${getPriorityColor(item.priority)}`}>
                  {item.priority}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">{item.action}</p>
                  <p className="text-xs text-slate-500 mt-1">{item.ad_set} · {item.expected_impact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ad breakdown table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden card-shadow">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900 text-sm">Ad Set Breakdown</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  {['Ad Set / Ad', 'Spend', 'ROAS', 'CTR', 'CPC', 'Conversions', 'Status'].map((h) => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {analysis.ad_breakdown.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-slate-900 max-w-[180px]">
                      <span className="truncate block" title={row.name}>{row.name}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">{formatCurrency(row.spend)}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">{formatROAS(row.roas)}</td>
                    <td className="py-3.5 px-4 text-slate-700">{formatPercent(row.ctr)}</td>
                    <td className="py-3.5 px-4 text-slate-700">{formatCurrency(row.cpc)}</td>
                    <td className="py-3.5 px-4 text-slate-700">{formatNumber(row.conversions)}</td>
                    <td className="py-3.5 px-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${getStatusColor(row.status)}`}>
                        {row.status === 'scale' ? '↑ Scale' : row.status === 'pause' ? '✕ Pause' : '◎ Monitor'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

   {/* Floating Chat Widget */}
<div className={`fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3`}>
  
  {/* Chat Panel */}
  {chatOpen && (
    <div className="w-80 h-[500px] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-fade-up">
      
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">AI Chat</p>
            <p className="text-xs text-slate-400">Ask about your data</p>
          </div>
        </div>
        <button
          onClick={() => setChatOpen(false)}
          className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {chatMessages.length === 0 && (
          <div className="space-y-2">
            <p className="text-xs text-slate-400 font-medium mb-3">Try asking:</p>
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => setChatInput(q)}
                className="w-full text-left text-xs bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-600 hover:text-indigo-700 px-3 py-2.5 rounded-lg transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {chatMessages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
              msg.role === 'user'
                ? 'bg-indigo-600 text-white rounded-br-sm'
                : 'bg-slate-100 text-slate-700 rounded-bl-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {chatLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 px-3.5 py-2.5 rounded-2xl rounded-bl-sm flex gap-1 items-center">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendChatMessage()}
            placeholder="Ask about your ads..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            onClick={sendChatMessage}
            disabled={!chatInput.trim() || chatLoading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white p-2.5 rounded-xl transition-colors flex-shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )}

 {/* Toggle Button */}
<button
  onClick={() => setChatOpen(!chatOpen)}
  className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white pl-4 pr-5 py-3.5 rounded-2xl shadow-lg shadow-indigo-200 transition-all hover:scale-105 active:scale-95"
>
  {chatOpen
    ? <X className="w-5 h-5 flex-shrink-0" />
    : (
      <>
        <div className="relative flex-shrink-0">
          <MessageSquare className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-indigo-600" />
        </div>
        <div className="text-left">
          <p className="text-xs font-semibold leading-tight">Ask AI</p>
          <p className="text-xs text-indigo-200 leading-tight">About your stats</p>
        </div>
      </>
    )
  }
</button>
</div>
    </div>
  );
}