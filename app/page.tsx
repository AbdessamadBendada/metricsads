'use client';

// app/page.tsx — MetaMetrics AI Landing Page

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  UploadCloud, Zap, BarChart3, ArrowRight, CheckCircle2,
  TrendingUp, TrendingDown, AlertCircle, Star, ChevronRight,
  Sparkles, Shield, Clock, Users, MessageSquare, FileSpreadsheet,
  Target, DollarSign, Eye, MousePointerClick,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass border-b border-slate-100 shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-slate-900 tracking-tight">MetaMetrics AI</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-slate-600">
          <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How it works</a>
          <a href="#demo" className="hover:text-slate-900 transition-colors">Demo</a>
          <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="text-sm text-slate-600 hover:text-slate-900 transition-colors font-medium">
            Sign in
          </Link>
          <Link
            href="/auth/signup"
            className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Get started free
          </Link>
        </div>
      </div>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="pt-32 pb-24 px-6 overflow-hidden">
      {/* Background gradient blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-30 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-indigo-200 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-64 h-64 bg-violet-200 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium px-4 py-1.5 rounded-full mb-8 animate-fade-up">
          <Sparkles className="w-3.5 h-3.5" />
          Powered by Gemini 1.5 Flash AI
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.05] tracking-tight mb-6 animate-fade-up animation-delay-100">
          Your Meta Ads,{' '}
          <span className="gradient-text">Explained in Plain English</span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10 animate-fade-up animation-delay-200">
          Stop staring at spreadsheets. Upload your export and let AI tell you exactly{' '}
          <strong className="text-slate-700 font-semibold">which ads to scale</strong> and{' '}
          <strong className="text-slate-700 font-semibold">which to kill</strong> — in seconds.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up animation-delay-300">
          <Link
            href="/auth/signup"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-8 py-3.5 rounded-xl font-semibold text-base transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5"
          >
            Analyze my ads for free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#demo"
            className="flex items-center gap-2 text-slate-700 hover:text-slate-900 px-6 py-3.5 rounded-xl font-medium text-base border border-slate-200 hover:border-slate-300 transition-all hover:bg-slate-50"
          >
            See a demo
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        {/* Trust line */}
        <p className="mt-6 text-sm text-slate-400 animate-fade-up animation-delay-400">
          Free forever · No credit card required · 2-minute setup
        </p>
      </div>
    </section>
  );
}

// ─── Marquee logos ─────────────────────────────────────────────────────────────

const LOGOS = [
  'Shopify Store', 'Local Bakery Co.', 'FitLife Studio', 'BeautyBox',
  'TechStart Inc.', 'GreenGrocer', 'HomeDecor', 'PetShop Pro',
  'YogaFlow', 'CraftBeer Co.', 'StyleBoutique', 'AutoParts Hub',
];

function TrustedBySection() {
  return (
    <section className="py-16 border-y border-slate-100 bg-slate-50/50 overflow-hidden">
      <p className="text-center text-sm font-medium text-slate-400 uppercase tracking-widest mb-10">
        Trusted by small businesses everywhere
      </p>
      <div className="relative">
        <div className="flex animate-marquee whitespace-nowrap gap-12 w-max">
          {[...LOGOS, ...LOGOS].map((logo, i) => (
            <span
              key={i}
              className="text-slate-400 font-semibold text-lg tracking-tight select-none"
            >
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Stats bar ─────────────────────────────────────────────────────────────────

function StatsBar() {
  const stats = [
    { value: '2 min', label: 'Average analysis time' },
    { value: '94%', label: 'Users improved ROAS' },
    { value: '12,000+', label: 'Ad sets analyzed' },
    { value: '4.9★', label: 'Average rating' },
  ];

  return (
    <section className="py-16 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-3xl font-bold text-slate-900 tracking-tight mb-1">{stat.value}</div>
            <div className="text-sm text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── How it works ─────────────────────────────────────────────────────────────

function HowItWorksSection() {
  const steps = [
    {
      step: '01',
      icon: FileSpreadsheet,
      title: 'Export & Upload',
      description:
        'Download your CSV from Meta Ads Manager (no integrations needed). Drag and drop it into MetaMetrics.',
      color: 'bg-indigo-50 text-indigo-600',
    },
    {
      step: '02',
      icon: Zap,
      title: 'AI Analysis',
      description:
        'Gemini AI reads every row of your data — spend, ROAS, CTR, CPC — and builds a complete picture of your campaigns.',
      color: 'bg-violet-50 text-violet-600',
    },
    {
      step: '03',
      icon: Target,
      title: 'Actionable Insights',
      description:
        'Get a plain-English report: what\'s working, what to kill, and exactly how to reallocate your budget today.',
      color: 'bg-emerald-50 text-emerald-600',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 px-6 bg-slate-50/60">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-indigo-600 font-semibold text-sm uppercase tracking-widest mb-3">
            How it works
          </p>
          <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">
            From CSV to clarity in 3 steps
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            No dashboards to learn, no integrations to set up. Just your data and plain-English answers.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div
              key={step.step}
              className="relative bg-white rounded-2xl p-8 card-shadow hover:card-shadow-hover transition-all group"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 -right-4 w-8 h-0.5 bg-slate-200 z-10" />
              )}
              <div className="flex items-start gap-4 mb-5">
                <div className={`p-3 rounded-xl ${step.color}`}>
                  <step.icon className="w-5 h-5" />
                </div>
                <span className="text-3xl font-bold text-slate-100 group-hover:text-slate-200 transition-colors mt-1">
                  {step.step}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Dashboard Demo Mockup ─────────────────────────────────────────────────────

function DemoSection() {
  const [activeTab, setActiveTab] = useState<'summary' | 'breakdown' | 'chat'>('summary');

  return (
    <section id="demo" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-indigo-600 font-semibold text-sm uppercase tracking-widest mb-3">
            Live preview
          </p>
          <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">
            See your ads in a whole new light
          </h2>
          <p className="text-slate-500 text-lg">
            This is what you get after uploading your CSV — no jargon, just answers.
          </p>
        </div>

        {/* Browser chrome mockup */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden card-shadow">
          {/* Browser bar */}
          <div className="flex items-center gap-2 px-5 py-3 bg-slate-50 border-b border-slate-200">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
            <div className="flex-1 mx-4 bg-white rounded-lg px-4 py-1.5 text-xs text-slate-400 border border-slate-200">
              app.metametrics.ai/dashboard
            </div>
          </div>

          <div className="p-6">
            {/* Tab nav */}
            <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit mb-6">
              {(['summary', 'breakdown', 'chat'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                    activeTab === tab
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab === 'summary' ? 'AI Summary' : tab === 'breakdown' ? 'Ad Breakdown' : 'AI Chat'}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === 'summary' && <DemoSummaryTab />}
            {activeTab === 'breakdown' && <DemoBreakdownTab />}
            {activeTab === 'chat' && <DemoChatTab />}
          </div>
        </div>
      </div>
    </section>
  );
}

function DemoSummaryTab() {
  return (
    <div className="space-y-5">
      {/* Bottom line */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
        <div className="flex items-center gap-2 text-indigo-700 font-semibold mb-2 text-sm">
          <Sparkles className="w-4 h-4" />
          The Bottom Line
        </div>
        <p className="text-slate-700 leading-relaxed">
          Your "Summer Sale — Lookalike 3%" ad set is carrying the entire campaign with a 4.2x return — 
          meaning every $1 you spend earns $4.20 back. However, your "Retargeting — 180 Days" ad set 
          has spent $312 this month with zero purchases, and should be paused immediately.
        </p>
      </div>

      {/* Winner / Loser */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
          <div className="flex items-center gap-2 text-emerald-700 font-semibold mb-3 text-sm">
            <TrendingUp className="w-4 h-4" />
            🏆 Top Performer
          </div>
          <p className="font-semibold text-slate-900 mb-1">Summer Sale — Lookalike 3%</p>
          <p className="text-sm text-slate-600 mb-4">Highest ROAS at 4.2x with strong CTR of 3.1%</p>
          <div className="grid grid-cols-3 gap-3">
            {[{ label: 'ROAS', value: '4.2x' }, { label: 'CTR', value: '3.1%' }, { label: 'CPC', value: '$0.89' }].map(m => (
              <div key={m.label} className="bg-white rounded-lg p-2 text-center">
                <div className="font-bold text-emerald-700">{m.value}</div>
                <div className="text-xs text-slate-500">{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-red-50 border border-red-100 rounded-xl p-5">
          <div className="flex items-center gap-2 text-red-700 font-semibold mb-3 text-sm">
            <TrendingDown className="w-4 h-4" />
            ⚠️ Needs Attention
          </div>
          <p className="font-semibold text-slate-900 mb-1">Retargeting — 180 Days</p>
          <p className="text-sm text-slate-600 mb-4">$312 spent this month with 0 purchases</p>
          <div className="grid grid-cols-3 gap-3">
            {[{ label: 'ROAS', value: '0x' }, { label: 'Spend', value: '$312' }, { label: 'Conv.', value: '0' }].map(m => (
              <div key={m.label} className="bg-white rounded-lg p-2 text-center">
                <div className="font-bold text-red-700">{m.value}</div>
                <div className="text-xs text-slate-500">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action plan */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="flex items-center gap-2 text-slate-700 font-semibold mb-4 text-sm">
          <Target className="w-4 h-4 text-indigo-600" />
          Your Action Plan
        </div>
        <div className="space-y-3">
          {[
            { priority: 'high', text: 'Pause "Retargeting — 180 Days" immediately — it\'s burning $10/day with no returns.' },
            { priority: 'high', text: 'Increase budget on "Summer Sale — Lookalike 3%" by 25% — it\'s your best performer.' },
            { priority: 'medium', text: 'Test a new creative for "Brand Awareness — Interests" — CTR has dropped 40% in 2 weeks.' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border mt-0.5 flex-shrink-0 ${
                item.priority === 'high' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {item.priority}
              </span>
              <p className="text-sm text-slate-600 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DemoBreakdownTab() {
  const rows = [
    { name: 'Summer Sale — Lookalike 3%', spend: '$842', roas: '4.2x', ctr: '3.1%', cpc: '$0.89', status: 'scale' },
    { name: 'Brand Awareness — Interests', spend: '$521', roas: '1.8x', ctr: '1.2%', cpc: '$1.45', status: 'monitor' },
    { name: 'Retargeting — 30 Days', spend: '$289', roas: '2.9x', ctr: '2.4%', cpc: '$1.10', status: 'scale' },
    { name: 'Retargeting — 180 Days', spend: '$312', roas: '0x', ctr: '0.4%', cpc: '$3.20', status: 'pause' },
  ];

  const statusStyle: Record<string, string> = {
    scale: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    monitor: 'bg-amber-50 text-amber-700 border border-amber-200',
    pause: 'bg-red-50 text-red-700 border border-red-200',
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100">
            {['Ad Set', 'Spend', 'ROAS', 'CTR', 'CPC', 'Recommendation'].map(h => (
              <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {rows.map((row) => (
            <tr key={row.name} className="hover:bg-slate-50/70 transition-colors">
              <td className="py-3.5 px-4 font-medium text-slate-900 max-w-[200px] truncate">{row.name}</td>
              <td className="py-3.5 px-4 text-slate-700">{row.spend}</td>
              <td className="py-3.5 px-4 text-slate-700 font-semibold">{row.roas}</td>
              <td className="py-3.5 px-4 text-slate-700">{row.ctr}</td>
              <td className="py-3.5 px-4 text-slate-700">{row.cpc}</td>
              <td className="py-3.5 px-4">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusStyle[row.status]}`}>
                  {row.status === 'scale' ? '↑ Scale' : row.status === 'pause' ? '✕ Pause' : '◎ Monitor'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DemoChatTab() {
  const messages = [
    { role: 'user', content: 'Why is my CPC so high on the 180-day retargeting?' },
    { role: 'assistant', content: 'Your 180-day retargeting audience is too broad — it includes people who visited your site once, months ago, and have likely forgotten about you. A $3.20 CPC with zero conversions tells me the audience is exhausted or irrelevant. I\'d suggest pausing it and rebuilding with a tighter 14-30 day window of visitors who actually engaged (product page views, add-to-carts).' },
    { role: 'user', content: 'How much should I increase the Lookalike budget?' },
    { role: 'assistant', content: 'Your Lookalike 3% is at a 4.2x ROAS — you\'re in strong scaling territory. A good rule of thumb is to increase by no more than 20-25% every 3-4 days to avoid resetting Meta\'s learning phase. Start by bumping from your current spend to about $1,050/day and watch the ROAS for 3 days before increasing again.' },
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-indigo-600 text-white rounded-br-sm'
                : 'bg-slate-100 text-slate-700 rounded-bl-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 border-t border-slate-100 pt-4">
        <input
          type="text"
          placeholder="Ask about your ads..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          disabled
        />
        <button className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium">
          Ask
        </button>
      </div>
      <p className="text-xs text-slate-400 text-center">Try it yourself after uploading your CSV →</p>
    </div>
  );
}

// ─── Features grid ─────────────────────────────────────────────────────────────

function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: 'Instant Analysis',
      description: 'Upload your CSV and get a full breakdown in under 2 minutes.',
      color: 'text-amber-600 bg-amber-50',
    },
    {
      icon: MessageSquare,
      title: 'Ask Anything',
      description: 'Chat with an AI that knows your specific ad data inside and out.',
      color: 'text-indigo-600 bg-indigo-50',
    },
    {
      icon: Target,
      title: 'Zero Jargon',
      description: 'ROAS, CTR, CPM — we explain everything in plain business language.',
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      icon: Shield,
      title: 'Your Data Stays Yours',
      description: 'We never store your CSV. Data is analyzed and immediately discarded.',
      color: 'text-violet-600 bg-violet-50',
    },
    {
      icon: Clock,
      title: 'Historical Tracking',
      description: 'Compare analysis reports over time to see if your changes worked.',
      color: 'text-rose-600 bg-rose-50',
    },
    {
      icon: BarChart3,
      title: 'Prioritized Actions',
      description: 'Get a ranked list of exactly what to do — starting with the highest impact.',
      color: 'text-sky-600 bg-sky-50',
    },
  ];

  return (
    <section className="py-24 px-6 bg-slate-50/60">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-indigo-600 font-semibold text-sm uppercase tracking-widest mb-3">
            Features
          </p>
          <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">
            Everything you need, nothing you don't
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-white rounded-2xl p-6 card-shadow hover:card-shadow-hover transition-all">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    quote: "I've been running Meta ads for 3 years and I've never understood them as clearly as I did after my first MetaMetrics report. I paused two ad sets immediately and saved $400 that month.",
    name: 'Sarah M.',
    role: 'Owner, The Little Candle Co.',
    rating: 5,
  },
  {
    quote: "The AI chat is genuinely useful — I asked why my CPM was rising and it gave me a 4-step explanation that actually made sense. No agency has ever done that.",
    name: 'James T.',
    role: 'Founder, FitWear Direct',
    rating: 5,
  },
  {
    quote: "Finally, a tool built for business owners, not media buyers. I spend 10 minutes a week on my ads now instead of 2 hours of confusion.",
    name: 'Maria L.',
    role: 'CEO, Bloom Botanics',
    rating: 5,
  },
];

function TestimonialsSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">
            Real results from real businesses
          </h2>
          <p className="text-slate-500 text-lg">
            Small business owners who stopped guessing and started knowing.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl p-6 card-shadow flex flex-col">
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-slate-600 leading-relaxed text-sm flex-1 mb-5">"{t.quote}"</p>
              <div>
                <p className="font-semibold text-slate-900 text-sm">{t.name}</p>
                <p className="text-xs text-slate-400">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

function PricingSection() {
  const features = [
    'Unlimited CSV uploads',
    'AI analysis on every upload',
    'Winner/loser identification',
    'Prioritized action plans',
    'AI chat about your data',
    'Analysis history',
    '50 AI analyses per month',
    'Email support',
  ];

  return (
    <section id="pricing" className="py-24 px-6 bg-slate-50/60">
      <div className="max-w-lg mx-auto text-center">
        <p className="text-indigo-600 font-semibold text-sm uppercase tracking-widest mb-3">
          Pricing
        </p>
        <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">
          Free forever. Seriously.
        </h2>
        <p className="text-slate-500 text-lg mb-12">
          We believe every small business should be able to understand their advertising.
        </p>

        <div className="bg-white rounded-2xl p-8 card-shadow border-2 border-indigo-500 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="bg-indigo-600 text-white text-xs font-semibold px-4 py-1 rounded-full">
              MOST POPULAR
            </span>
          </div>

          <div className="mb-6">
            <div className="text-5xl font-bold text-slate-900 mb-1">$0</div>
            <div className="text-slate-500">per month, forever</div>
          </div>

          <div className="space-y-3 mb-8 text-left">
            {features.map((f) => (
              <div key={f} className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span className="text-sm text-slate-700">{f}</span>
              </div>
            ))}
          </div>

          <Link
            href="/auth/signup"
            className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-semibold transition-all"
          >
            Start analyzing for free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA ────────────────────────────────────────────────────────────────

function CTASection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl p-12 text-white">
          <h2 className="text-4xl font-bold mb-4 tracking-tight">
            Stop guessing. Start knowing.
          </h2>
          <p className="text-indigo-200 text-lg mb-8">
            Your next CSV export is moments away from becoming your clearest competitive advantage.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50 px-8 py-3.5 rounded-xl font-semibold transition-colors"
          >
            Analyze my ads for free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-slate-100">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-semibold text-slate-900 text-sm">MetaMetrics AI</span>
        </div>
        <p className="text-sm text-slate-400">
          © {new Date().getFullYear()} MetaMetrics AI. Not affiliated with Meta Platforms, Inc.
        </p>
        <div className="flex gap-6 text-sm text-slate-400">
          <a href="#" className="hover:text-slate-700 transition-colors">Privacy</a>
          <a href="#" className="hover:text-slate-700 transition-colors">Terms</a>
          <a href="mailto:hello@metametrics.ai" className="hover:text-slate-700 transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page export
// ─────────────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="relative overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <TrustedBySection />
        <StatsBar />
        <HowItWorksSection />
        <DemoSection />
        <FeaturesSection />
        <TestimonialsSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}