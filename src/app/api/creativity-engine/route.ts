import type { NextRequest } from "next/server";

/**
 * Creativity Engine API — runs the 4-phase bisociation pipeline on Claude.
 *
 * Input:  { problem: string }        // the design problem, 10-800 chars
 * Output: { incubate, diverge, switch: switchResults, converge }
 *
 * Env:    ANTHROPIC_API_KEY must be set in Vercel project env.
 *
 * Rate limit: best-effort in-memory, 5 requests per IP per hour.
 * Not reliable across serverless cold starts — upgrade to Upstash/KV when traffic warrants.
 */

export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = "claude-sonnet-4-6";
const MAX_PROBLEM_LEN = 800;
const MIN_PROBLEM_LEN = 10;

// --- Simple in-memory rate limit (best-effort) ---------------------------
type Bucket = { count: number; resetAt: number };
const rateBuckets = new Map<string, Bucket>();
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT = 5;

function checkRateLimit(ip: string): { ok: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const bucket = rateBuckets.get(ip);

  if (!bucket || bucket.resetAt < now) {
    const fresh = { count: 1, resetAt: now + RATE_WINDOW_MS };
    rateBuckets.set(ip, fresh);
    return { ok: true, remaining: RATE_LIMIT - 1, resetAt: fresh.resetAt };
  }

  if (bucket.count >= RATE_LIMIT) {
    return { ok: false, remaining: 0, resetAt: bucket.resetAt };
  }

  bucket.count += 1;
  return { ok: true, remaining: RATE_LIMIT - bucket.count, resetAt: bucket.resetAt };
}

// --- Prompt --------------------------------------------------------------
const SYSTEM_PROMPT = `You are the Creativity Engine — a bisociation pipeline that produces novel design ideas by colliding a problem with unrelated domains.

You run in four phases that mirror how the brain produces insight:
1. INCUBATE (Default Mode Network): pull signals from 3 domains unrelated to tech and unrelated to the problem's industry. Mind-wander on purpose.
2. DIVERGE (DMN → ECN handoff): generate 6 bisociations. Each pairs the problem with one domain. Score semantic distance 0-10 (0 = obvious, 10 = nonsense). Target distance 5-7.
3. SWITCH (Salience Network): score each bisociation on Surprise, Coherence, Timing, Zero-Audience (each 1-5). Kill any with surprise<3 OR coherence<3.
4. CONVERGE (Executive Control Network): pick the highest-combined-score survivor. Build a concept card.

Output STRICT JSON only, no prose, no markdown fences, no commentary.`;

function userPrompt(problem: string): string {
  return `PROBLEM:
${problem}

Run the 4-phase engine. Return this exact JSON shape:

{
  "incubate": {
    "domains": [
      { "name": "string", "signal": "one sentence about what this domain knows that tech doesn't" }
    ]
  },
  "diverge": [
    { "domain": "string (one of the incubated)", "bisociation": "string — the forced pairing, one sentence", "distance": number 0-10 }
  ],
  "switch": [
    {
      "bisociation": "string (matches one from diverge)",
      "surprise": 1-5,
      "coherence": 1-5,
      "timing": 1-5,
      "zero_audience": 1-5,
      "verdict": "pass" | "kill",
      "reasoning": "one sentence"
    }
  ],
  "converge": {
    "winner": "string — the winning bisociation",
    "user_story": "string — what a user experiences, one or two sentences",
    "implementation_sketch": "string — how it would actually be built, two or three sentences",
    "why_it_beats_obvious": "string — what the obvious solution would have been and why this is better",
    "risks": ["string", "string"]
  }
}

Constraints:
- incubate.domains: exactly 3 items, all non-tech, all outside the problem's industry
- diverge: exactly 6 items, most with distance 5-7
- switch: score every diverge item, kill anything with surprise<3 OR coherence<3
- converge.winner: highest combined (surprise+coherence+timing+zero_audience) among verdict=pass items
- Be specific. "Use AI" is not a bisociation. "Treat each onboarding step like a museum wall text — minimal copy, maximum legibility, one artifact at a time" is.`;
}

// --- Handler -------------------------------------------------------------
export async function POST(request: NextRequest) {
  // IP extraction — works on Vercel's edge infra
  const forwarded = request.headers.get("x-forwarded-for") ?? "";
  const ip = forwarded.split(",")[0].trim() || "unknown";

  const rate = checkRateLimit(ip);
  if (!rate.ok) {
    const minutes = Math.ceil((rate.resetAt - Date.now()) / 60000);
    return Response.json(
      {
        error: "rate_limited",
        message: `You've hit the hourly limit for this demo. Try again in ~${minutes} minutes, or email me if you'd like a higher limit.`,
      },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const problem = typeof (body as { problem?: unknown })?.problem === "string"
    ? ((body as { problem: string }).problem).trim()
    : "";

  if (problem.length < MIN_PROBLEM_LEN) {
    return Response.json(
      { error: "too_short", message: `Problem must be at least ${MIN_PROBLEM_LEN} characters.` },
      { status: 400 }
    );
  }
  if (problem.length > MAX_PROBLEM_LEN) {
    return Response.json(
      { error: "too_long", message: `Problem must be under ${MAX_PROBLEM_LEN} characters.` },
      { status: 400 }
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json(
      {
        error: "server_not_configured",
        message: "The Creativity Engine isn't configured yet. ANTHROPIC_API_KEY needs to be set in Vercel project env vars.",
      },
      { status: 500 }
    );
  }

  // Call Claude
  let resp: Response;
  try {
    resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userPrompt(problem) }],
      }),
    });
  } catch (err) {
    return Response.json(
      { error: "upstream_unreachable", message: String(err) },
      { status: 502 }
    );
  }

  if (!resp.ok) {
    const detail = await resp.text();
    return Response.json(
      { error: "upstream_error", status: resp.status, detail: detail.slice(0, 500) },
      { status: 502 }
    );
  }

  const data = (await resp.json()) as {
    content?: Array<{ type: string; text?: string }>;
  };

  const text =
    data.content?.find((c) => c.type === "text")?.text?.trim() ?? "";

  if (!text) {
    return Response.json(
      { error: "empty_response", message: "The engine returned an empty response." },
      { status: 502 }
    );
  }

  // Strip any accidental markdown fences or preamble
  const jsonStart = text.indexOf("{");
  const jsonEnd = text.lastIndexOf("}");
  const jsonText =
    jsonStart >= 0 && jsonEnd > jsonStart ? text.slice(jsonStart, jsonEnd + 1) : text;

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    return Response.json(
      {
        error: "parse_error",
        message: "The engine returned invalid JSON. Try a shorter or clearer problem.",
        raw: text.slice(0, 500),
      },
      { status: 502 }
    );
  }

  return Response.json(
    { ok: true, result: parsed, rateRemaining: rate.remaining },
    { status: 200 }
  );
}

export async function GET() {
  return Response.json({
    engine: "Creativity Engine",
    version: "1.0",
    usage: "POST with { problem: string }",
  });
}
