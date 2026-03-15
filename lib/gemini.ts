const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

async function callGroq(
  messages: GroqMessage[],
): Promise<{ text: string; tokensUsed: number }> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY is not set');

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.4,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq API error ${response.status}: ${error}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content ?? '';
  const tokensUsed = data.usage?.total_tokens ?? 0;

  return { text, tokensUsed };
}

const ANALYSIS_SYSTEM_PROMPT = `You are MetaMetrics AI, an expert Meta (Facebook/Instagram) Ads analyst.
Your job is to analyze CSV data exported from Meta Ads Manager and provide plain-English insights that any small business owner can understand.
Never use jargon. Be direct, actionable, and honest.
Always respond with ONLY valid JSON matching the exact schema provided — no markdown fences, no preamble, no extra text.`;

export async function analyzeMetaAdsCsv(csvContent: string): Promise<{
  summary: string;
  topPerformerName: string;
  topPerformerReason: string;
  topPerformerMetrics: Record<string, number>;
  worstPerformerName: string;
  worstPerformerReason: string;
  worstPerformerMetrics: Record<string, number>;
  totalSpend: number;
  totalConversions: number;
  overallRoas: number;
  avgCpc: number;
  avgCtr: number;
  totalImpressions: number;
  totalClicks: number;
  actionItems: Array<{
    priority: 'high' | 'medium' | 'low';
    action: string;
    adSet: string;
    expectedImpact: string;
  }>;
  adBreakdown: Array<{
    name: string;
    spend: number;
    roas: number;
    ctr: number;
    cpc: number;
    impressions: number;
    clicks: number;
    conversions: number;
    status: 'scale' | 'pause' | 'monitor';
  }>;
  rawText: string;
  tokensUsed: number;
}> {
  const prompt = `Analyze the following Meta Ads CSV export and return a JSON object with this EXACT schema:

{
  "summary": "2 sentences max. Plain English bottom-line summary of overall performance.",
  "topPerformerName": "Ad set or ad name",
  "topPerformerReason": "1 sentence explaining why in plain English",
  "topPerformerMetrics": { "spend": 0, "roas": 0, "ctr": 0, "cpc": 0, "conversions": 0 },
  "worstPerformerName": "Ad set or ad name",
  "worstPerformerReason": "1 sentence explaining why in plain English",
  "worstPerformerMetrics": { "spend": 0, "roas": 0, "ctr": 0, "cpc": 0, "conversions": 0 },
  "totalSpend": 0,
  "totalConversions": 0,
  "overallRoas": 0,
  "avgCpc": 0,
  "avgCtr": 0,
  "totalImpressions": 0,
  "totalClicks": 0,
  "actionItems": [
    {
      "priority": "high|medium|low",
      "action": "Clear instruction in plain English",
      "adSet": "Name of the ad set this applies to",
      "expectedImpact": "What will happen if they do this"
    }
  ],
  "adBreakdown": [
    {
      "name": "Ad or ad set name",
      "spend": 0,
      "roas": 0,
      "ctr": 0,
      "cpc": 0,
      "impressions": 0,
      "clicks": 0,
      "conversions": 0,
      "status": "scale|pause|monitor"
    }
  ]
}

Rules:
- status "scale" = ROAS > 2 or CTR > 2%
- status "pause" = ROAS < 1 or spend > $50 with 0 conversions
- status "monitor" = everything else
- CTR values should be percentages (e.g., 2.5 not 0.025)
- Provide 3-5 actionItems ranked by priority
- Include ALL ad sets/ads in adBreakdown
- Return ONLY the JSON object, nothing else

CSV DATA:
${csvContent.slice(0, 50000)}`;

  const { text, tokensUsed } = await callGroq([
    { role: 'system', content: ANALYSIS_SYSTEM_PROMPT },
    { role: 'user', content: prompt },
  ]);

  const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  try {
    const parsed = JSON.parse(clean);
    return { ...parsed, rawText: text, tokensUsed };
  } catch {
    throw new Error(`Failed to parse AI response as JSON: ${text.slice(0, 500)}`);
  }
}

export async function chatAboutAds(
  userMessage: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }>,
  csvSummary: string
): Promise<string> {
  const systemPrompt = `You are MetaMetrics AI, a friendly Meta Ads expert chatbot.
The user has uploaded their Meta Ads CSV data. Here is a summary of their data:

${csvSummary}

Answer their questions in plain English. Be specific, reference actual numbers from their data when possible.
Keep answers concise (2-4 sentences unless a detailed breakdown is needed).
Never use marketing jargon without explaining it.`;

  const messages: GroqMessage[] = [
    { role: 'system', content: systemPrompt },
    ...history.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user', content: userMessage },
  ];

  const { text } = await callGroq(messages);
  return text;
}