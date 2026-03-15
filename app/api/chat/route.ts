// app/api/chat/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { chatAboutAds } from '@/lib/gemini';
import type { ChatRequest } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequest = await req.json();
    const { uploadId, message, history, csvSummary } = body;

    if (!uploadId || !message) {
      return NextResponse.json(
        { success: false, error: 'uploadId and message are required.' },
        { status: 400 }
      );
    }

    // Verify user is authenticated
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
    }

    // Verify upload belongs to user
    const { data: upload } = await supabase
      .from('uploads')
      .select('id, user_id')
      .eq('id', uploadId)
      .eq('user_id', user.id)
      .single();

    if (!upload) {
      return NextResponse.json({ success: false, error: 'Upload not found.' }, { status: 404 });
    }

    // Get AI response
    const reply = await chatAboutAds(
      message,
      history || [],
      csvSummary || 'No summary available.'
    );

    // Persist both messages to DB
    const admin = createAdminClient();
    await admin.from('chat_messages').insert([
      { upload_id: uploadId, user_id: user.id, role: 'user', content: message },
      { upload_id: uploadId, user_id: user.id, role: 'assistant', content: reply },
    ]);

    return NextResponse.json({ success: true, reply });
  } catch (error: unknown) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get AI response.' },
      { status: 500 }
    );
  }
}