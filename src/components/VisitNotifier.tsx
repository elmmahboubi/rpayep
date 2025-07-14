'use client';
import { useEffect } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

export default function VisitNotifier() {
  useEffect(() => {
    (async () => {
      try {
        // Get IP and country
        const ipRes = await fetch('https://ipapi.co/json/');
        const ipData = await ipRes.json();

        // Get device info
        const device = `${navigator.platform} - ${navigator.userAgent}`;

        // Get fingerprint
        const fp = await FingerprintJS.load();
        const result = await fp.get();

        // Date and time
        const now = new Date();
        const date = now.toLocaleDateString();
        const time = now.toLocaleTimeString();

        // Send to API
        await fetch('/api/notify-visit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ip: ipData.ip,
            country: ipData.country_name,
            device,
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