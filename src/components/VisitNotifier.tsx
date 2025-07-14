'use client';
import { useEffect } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

function getDeviceType(ua: string) {
  if (/Mobi|Android/i.test(ua)) return 'Mobile';
  if (/Tablet|iPad/i.test(ua)) return 'Tablet';
  return 'Desktop';
}

function countryCodeToFlagEmoji(countryCode: string) {
  if (!countryCode) return '';
  return countryCode
    .toUpperCase()
    .replace(/./g, char =>
      String.fromCodePoint(127397 + char.charCodeAt(0))
    );
}

export default function VisitNotifier() {
  useEffect(() => {
    (async () => {
      try {
        // Get IP and country
        const ipRes = await fetch('https://ipapi.co/json/');
        const ipData = await ipRes.json();

        // Get device info
        const device = `${navigator.platform} - ${navigator.userAgent}`;
        const deviceType = getDeviceType(navigator.userAgent);

        // Get fingerprint
        const fp = await FingerprintJS.load();
        const result = await fp.get();

        // Date and time
        const now = new Date();
        const date = now.toLocaleDateString();
        const time = now.toLocaleTimeString();

        // Country flag
        const countryFlag = countryCodeToFlagEmoji(ipData.country_code || '');

        // Send to API
        await fetch('/api/notify-visit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ip: ipData.ip,
            country: ipData.country_name,
            countryFlag,
            device,
            deviceType,
            fingerprint: result.visitorId,
            date,
            time,
          }),
        });
      } catch (e) {
        // Fail silently
        console.error('Visit notification failed:', e);
      }
    })();
  }, []);

  return null;
} 