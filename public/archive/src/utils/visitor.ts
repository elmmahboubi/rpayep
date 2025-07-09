import UAParser from 'ua-parser-js';

export async function notifyVisitor() {
  try {
    // Get device info
    const parser = new UAParser();
    const result = parser.getResult();

    console.log('Visitor info:', {
      domain: window.location.hostname,
      device: {
        browser: result.browser.name || 'Unknown',
        os: result.os.name || 'Unknown',
        device: result.device.type || 'desktop'
      },
      timestamp: new Date().toLocaleString('en-US', { 
        timeZone: 'America/New_York',
        dateStyle: 'short',
        timeStyle: 'short'
      })
    });

  } catch (error) {
    console.error('Failed to collect visitor info:', error);
  }
}