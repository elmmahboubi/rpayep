import { NextRequest, NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

function deviceTypeEmoji(type: string) {
  if (type === 'Mobile') return '📱';
  if (type === 'Tablet') return '💻';
  return '🖥️';
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { ip, country, countryFlag, device, deviceType, fingerprint, date, time } = data;

    const message = [
      '👀 <b>New Website Visit</b> 🚀',
      `🌐 <b>IP:</b> <code>${ip}</code>`,
      `🏳️ <b>Country:</b> ${countryFlag ? countryFlag + ' ' : ''}${country}`,
      `${deviceTypeEmoji(deviceType)} <b>Device:</b> ${deviceType} <code>${device}</code>`,
      `🆔 <b>Fingerprint:</b> <code>${fingerprint}</code>`,
      `📅 <b>Date:</b> <code>${date}</code>`,
      `⏰ <b>Time:</b> <code>${time}</code>`
    ].join('\n');

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const tgRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    if (!tgRes.ok) {
      // TODO: Add Supabase logging here if desired
      console.error('Telegram API failed', await tgRes.text());
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Notify-visit API error:', e);
    return NextResponse.json({ ok: false, error: String(e) });
  }
}

export async function GET() {
  return NextResponse.json({ ok: false, error: 'Use POST' }, { status: 405 });
} 