// types/index.ts

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  plan: 'free' | 'pro' | 'enterprise';
  analyses_used: number;
  analyses_limit: number;
  created_at: string;
  updated_at: string;
}

export interface Upload {
  id: string;
  user_id: string;
  file_name: string;
  file_size_bytes: number | null;
  row_count: number | null;
  date_range_start: string | null;
  date_range_end: string | null;
  ad_account_name: string | null;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error_message: string | null;
  storage_path: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdMetrics {
  spend: number;
  roas: number;
  ctr: number;
  cpc: number;
  conversions: number;
}

export interface ActionItem {
  priority: 'high' | 'medium' | 'low';
  action: string;
  ad_set: string;
  expected_impact: string;
}

export interface AdBreakdownItem {
  name: string;
  spend: number;
  roas: number;
  ctr: number;
  cpc: number;
  impressions: number;
  clicks: number;
  conversions: number;
  status: 'scale' | 'pause' | 'monitor';
}

export interface Analysis {
  id: string;
  upload_id: string;
  user_id: string;
  summary: string;
  top_performer_name: string | null;
  top_performer_reason: string | null;
  top_performer_metrics: AdMetrics | null;
  worst_performer_name: string | null;
  worst_performer_reason: string | null;
  worst_performer_metrics: AdMetrics | null;
  total_spend: number | null;
  total_conversions: number | null;
  overall_roas: number | null;
  avg_cpc: number | null;
  avg_ctr: number | null;
  total_impressions: number | null;
  total_clicks: number | null;
  action_items: ActionItem[];
  ad_breakdown: AdBreakdownItem[];
  raw_ai_response: string | null;
  gemini_model: string | null;
  tokens_used: number | null;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  upload_id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

// API request/response types
export interface AnalyzeRequest {
  uploadId: string;
  csvContent: string;
  fileName: string;
}

export interface AnalyzeResponse {
  success: boolean;
  analysisId?: string;
  analysis?: Analysis;
  error?: string;
}

export interface ChatRequest {
  uploadId: string;
  message: string;
  history: Array<{ role: 'user' | 'assistant'; content: string }>;
  csvSummary?: string;
}

export interface ChatResponse {
  success: boolean;
  reply?: string;
  error?: string;
}