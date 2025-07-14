import { NextRequest, NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { ip, country, device, fingerprint, date, time } = data;

    // Telegram message
    const message = `\nNew Website Visit 🚀\nIP: ${ip}\nCountry: ${country}\nDevice: ${device}\nFingerprint: ${fingerprint}\nDate: ${date}\nTime: ${time}`.trim();

    // Send to Telegram
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const tgRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    // Optionally log to Supabase if Telegram fails
    if (!tgRes.ok) {
      // TODO: Add Supabase logging here if desired
      console.error('Telegram API failed', await tgRes.text());
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    // Log error but never throw, so the site never crashes
    console.error('Notify-visit API error:', e);
    return NextResponse.json({ ok: false, error: String(e) });
  }
}

// Optionally handle GET for debugging
export async function GET() {
  return NextResponse.json({ ok: false, error: 'Use POST' }, { status: 405 });
} 