// app/api/analyze/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { analyzeMetaAdsCsv } from '@/lib/gemini';
import type { AnalyzeRequest } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body: AnalyzeRequest = await req.json();
    console.log('Gemini key exists:', !!process.env.GEMINI_API_KEY);

    const { uploadId, csvContent, fileName } = body;

    if (!uploadId || !csvContent) {
      return NextResponse.json(
        { success: false, error: 'uploadId and csvContent are required.' },
        { status: 400 }
      );
    }

    // Limit CSV size to protect free tier
    if (csvContent.length > 500_000) {
      return NextResponse.json(
        { success: false, error: 'CSV file is too large. Please export a smaller date range.' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Update upload status to processing
    await supabase
      .from('uploads')
      .update({ status: 'processing' })
      .eq('id', uploadId);

    // Run Gemini analysis
    let analysisData;
    try {
      analysisData = await analyzeMetaAdsCsv(csvContent);
    } catch (aiError: unknown) {
      // Mark upload as failed
      console.log('AI Error:', aiError); 
      await supabase
        .from('uploads')
        .update({
          status: 'failed',
          error_message: aiError instanceof Error ? aiError.message : 'AI analysis failed',
        })
        .eq('id', uploadId);

      return NextResponse.json(
        { success: false, error: 'AI analysis failed. Please try again.' },
        { status: 500 }
      );
    }

    // Save analysis to DB
    const { data: analysis, error: dbError } = await supabase
      .from('analyses')
      .insert({
        upload_id: uploadId,
        // We need the user_id — get it from the upload record
        user_id: await getUserIdFromUpload(supabase, uploadId),
        summary: analysisData.summary,
        top_performer_name: analysisData.topPerformerName,
        top_performer_reason: analysisData.topPerformerReason,
        top_performer_metrics: analysisData.topPerformerMetrics,
        worst_performer_name: analysisData.worstPerformerName,
        worst_performer_reason: analysisData.worstPerformerReason,
        worst_performer_metrics: analysisData.worstPerformerMetrics,
        total_spend: analysisData.totalSpend,
        total_conversions: analysisData.totalConversions,
        overall_roas: analysisData.overallRoas,
        avg_cpc: analysisData.avgCpc,
        avg_ctr: analysisData.avgCtr,
        total_impressions: analysisData.totalImpressions,
        total_clicks: analysisData.totalClicks,
        action_items: analysisData.actionItems.map((item) => ({
          priority: item.priority,
          action: item.action,
          ad_set: item.adSet,
          expected_impact: item.expectedImpact,
        })),
        ad_breakdown: analysisData.adBreakdown,
        raw_ai_response: analysisData.rawText,
        gemini_model: 'llama-3.3-70b-versatile',
        tokens_used: analysisData.tokensUsed,
      })
      .select()
      .single();

    if (dbError) {
      console.error('DB insert error:', dbError);
      throw dbError;
    }

    // Mark upload as completed
    await supabase
      .from('uploads')
      .update({
        status: 'completed',
        row_count: analysisData.adBreakdown.length,
      })
      .eq('id', uploadId);

    // Increment analyses_used counter
    const userId = await getUserIdFromUpload(supabase, uploadId);
    if (userId) {
      await supabase.rpc('increment_analyses_used', { user_id_input: userId });
    }

    return NextResponse.json({
      success: true,
      analysisId: analysis.id,
      analysis,
    });
  } catch (error: unknown) {
    console.error('Analysis API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 }
    );
  }
}

async function getUserIdFromUpload(
  supabase: ReturnType<typeof createAdminClient>,
  uploadId: string
): Promise<string> {
  const { data } = await supabase
    .from('uploads')
    .select('user_id')
    .eq('id', uploadId)
    .single();
  return data?.user_id ?? '';
}