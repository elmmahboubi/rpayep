import { NextRequest, NextResponse } from 'next/server';

// IMPORTANT: Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in your Vercel environment variables!
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { ip, country, device, fingerprint, date, time } = data;

    const message = `\nNew Website Visit 🚀\nIP: ${ip}\nCountry: ${country}\nDevice: ${device}\nFingerprint: ${fingerprint}\nDate: ${date}\nTime: ${time}`.trim();

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    // Log error but never throw, so the site never crashes
    console.error('Telegram notification failed:', e);
    return NextResponse.json({ ok: false });
  }
} 