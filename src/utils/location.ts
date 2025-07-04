export interface LocationInfo {
  country: string;
  countryCode: string;
  city?: string;
  region?: string;
}

export async function getUserLocation(): Promise<LocationInfo> {
  // Method 2: Try ip-api.com (free, no API key required)
  try {
    const response = await fetch('http://ip-api.com/json/', {
      method: 'GET',
    });
    
    if (response.ok) {
      const data = await response.json();
      
      if (data.country && data.countryCode && data.status === 'success') {
        return {
          country: data.country,
          countryCode: data.countryCode.toUpperCase(),
          city: data.city,
          region: data.regionName
        };
      }
    }
  } catch (error) {
    console.warn('ip-api.com failed:', error);
  }

  // Method 3: Try ipinfo.io (free tier available)
  try {
    const response = await fetch('https://ipinfo.io/json', {
      method: 'GET',
    });
    
    if (response.ok) {
      const data = await response.json();
      
      if (data.country) {
        const countryNames = getCountryNameFromCode(data.country);
        return {
          country: countryNames.name,
          countryCode: data.country.toUpperCase(),
          city: data.city,
          region: data.region
        };
      }
    }
  } catch (error) {
    console.warn('ipinfo.io failed:', error);
  }

  // Method 4: Fallback to timezone-based detection
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const timezoneLocation = getLocationFromTimezone(timezone);
    if (timezoneLocation) {
      return timezoneLocation;
    }
  } catch (error) {
    console.warn('Timezone detection failed:', error);
  }

  // Method 5: Fallback to locale-based detection
  try {
    const locale = navigator.language || 'en-US';
    const localeLocation = getLocationFromLocale(locale);
    if (localeLocation) {
      return localeLocation;
    }
  } catch (error) {
    console.warn('Locale detection failed:', error);
  }

  // Final fallback
  return { 
    country: 'your location', 
    countryCode: 'UNKNOWN' 
  };
}

function getCountryNameFromCode(code: string): { name: string; code: string } {
  const countryMap: Record<string, string> = {
    'US': 'United States',
    'CA': 'Canada',
    'GB': 'United Kingdom',
    'FR': 'France',
    'DE': 'Germany',
    'IT': 'Italy',
    'ES': 'Spain',
    'JP': 'Japan',
    'AU': 'Australia',
    'BR': 'Brazil',
    'MX': 'Mexico',
    'IN': 'India',
    'CN': 'China',
    'KR': 'South Korea',
    'NL': 'Netherlands',
    'SE': 'Sweden',
    'NO': 'Norway',
    'DK': 'Denmark',
    'FI': 'Finland',
    'CH': 'Switzerland',
    'AT': 'Austria',
    'BE': 'Belgium',
    'PT': 'Portugal',
    'IE': 'Ireland',
    'NZ': 'New Zealand',
    'SG': 'Singapore',
    'HK': 'Hong Kong',
    'TW': 'Taiwan',
    'TH': 'Thailand',
    'MY': 'Malaysia',
    'PH': 'Philippines',
    'ID': 'Indonesia',
    'VN': 'Vietnam',
    'ZA': 'South Africa',
    'EG': 'Egypt',
    'NG': 'Nigeria',
    'KE': 'Kenya',
    'MA': 'Morocco',
    'AR': 'Argentina',
    'CL': 'Chile',
    'CO': 'Colombia',
    'PE': 'Peru',
    'VE': 'Venezuela',
    'UY': 'Uruguay',
    'EC': 'Ecuador',
    'BO': 'Bolivia',
    'PY': 'Paraguay',
    'CR': 'Costa Rica',
    'PA': 'Panama',
    'GT': 'Guatemala',
    'HN': 'Honduras',
    'SV': 'El Salvador',
    'NI': 'Nicaragua',
    'BZ': 'Belize',
    'JM': 'Jamaica',
    'TT': 'Trinidad and Tobago',
    'BB': 'Barbados',
    'GD': 'Grenada',
    'LC': 'Saint Lucia',
    'VC': 'Saint Vincent and the Grenadines',
    'DM': 'Dominica',
    'AG': 'Antigua and Barbuda',
    'KN': 'Saint Kitts and Nevis',
    'BS': 'Bahamas',
    'CU': 'Cuba',
    'DO': 'Dominican Republic',
    'HT': 'Haiti',
    'PR': 'Puerto Rico'
  };
  
  return {
    name: countryMap[code.toUpperCase()] || code,
    code: code.toUpperCase()
  };
}

function getLocationFromTimezone(timezone: string): LocationInfo | null {
  const timezoneCountryMap: Record<string, LocationInfo> = {
    // North America
    'America/New_York': { country: 'United States', countryCode: 'US' },
    'America/Los_Angeles': { country: 'United States', countryCode: 'US' },
    'America/Chicago': { country: 'United States', countryCode: 'US' },
    'America/Denver': { country: 'United States', countryCode: 'US' },
    'America/Phoenix': { country: 'United States', countryCode: 'US' },
    'America/Anchorage': { country: 'United States', countryCode: 'US' },
    'Pacific/Honolulu': { country: 'United States', countryCode: 'US' },
    'America/Toronto': { country: 'Canada', countryCode: 'CA' },
    'America/Vancouver': { country: 'Canada', countryCode: 'CA' },
    'America/Montreal': { country: 'Canada', countryCode: 'CA' },
    'America/Halifax': { country: 'Canada', countryCode: 'CA' },
    'America/Mexico_City': { country: 'Mexico', countryCode: 'MX' },
    
    // Europe
    'Europe/London': { country: 'United Kingdom', countryCode: 'GB' },
    'Europe/Paris': { country: 'France', countryCode: 'FR' },
    'Europe/Berlin': { country: 'Germany', countryCode: 'DE' },
    'Europe/Rome': { country: 'Italy', countryCode: 'IT' },
    'Europe/Madrid': { country: 'Spain', countryCode: 'ES' },
    'Europe/Amsterdam': { country: 'Netherlands', countryCode: 'NL' },
    'Europe/Stockholm': { country: 'Sweden', countryCode: 'SE' },
    'Europe/Oslo': { country: 'Norway', countryCode: 'NO' },
    'Europe/Copenhagen': { country: 'Denmark', countryCode: 'DK' },
    'Europe/Helsinki': { country: 'Finland', countryCode: 'FI' },
    'Europe/Zurich': { country: 'Switzerland', countryCode: 'CH' },
    'Europe/Vienna': { country: 'Austria', countryCode: 'AT' },
    'Europe/Brussels': { country: 'Belgium', countryCode: 'BE' },
    'Europe/Lisbon': { country: 'Portugal', countryCode: 'PT' },
    'Europe/Dublin': { country: 'Ireland', countryCode: 'IE' },
    
    // Asia Pacific
    'Asia/Tokyo': { country: 'Japan', countryCode: 'JP' },
    'Asia/Shanghai': { country: 'China', countryCode: 'CN' },
    'Asia/Seoul': { country: 'South Korea', countryCode: 'KR' },
    'Asia/Singapore': { country: 'Singapore', countryCode: 'SG' },
    'Asia/Hong_Kong': { country: 'Hong Kong', countryCode: 'HK' },
    'Asia/Taipei': { country: 'Taiwan', countryCode: 'TW' },
    'Asia/Bangkok': { country: 'Thailand', countryCode: 'TH' },
    'Asia/Kuala_Lumpur': { country: 'Malaysia', countryCode: 'MY' },
    'Asia/Manila': { country: 'Philippines', countryCode: 'PH' },
    'Asia/Jakarta': { country: 'Indonesia', countryCode: 'ID' },
    'Asia/Ho_Chi_Minh': { country: 'Vietnam', countryCode: 'VN' },
    'Asia/Kolkata': { country: 'India', countryCode: 'IN' },
    'Australia/Sydney': { country: 'Australia', countryCode: 'AU' },
    'Australia/Melbourne': { country: 'Australia', countryCode: 'AU' },
    'Australia/Perth': { country: 'Australia', countryCode: 'AU' },
    'Pacific/Auckland': { country: 'New Zealand', countryCode: 'NZ' },
    
    // South America
    'America/Sao_Paulo': { country: 'Brazil', countryCode: 'BR' },
    'America/Buenos_Aires': { country: 'Argentina', countryCode: 'AR' },
    'America/Santiago': { country: 'Chile', countryCode: 'CL' },
    'America/Bogota': { country: 'Colombia', countryCode: 'CO' },
    'America/Lima': { country: 'Peru', countryCode: 'PE' },
    'America/Caracas': { country: 'Venezuela', countryCode: 'VE' },
    
    // Africa
    'Africa/Johannesburg': { country: 'South Africa', countryCode: 'ZA' },
    'Africa/Cairo': { country: 'Egypt', countryCode: 'EG' },
    'Africa/Lagos': { country: 'Nigeria', countryCode: 'NG' },
    'Africa/Nairobi': { country: 'Kenya', countryCode: 'KE' },
    'Africa/Casablanca': { country: 'Morocco', countryCode: 'MA' }
  };
  
  return timezoneCountryMap[timezone] || null;
}

function getLocationFromLocale(locale: string): LocationInfo | null {
  const localeCountryMap: Record<string, LocationInfo> = {
    'en-US': { country: 'United States', countryCode: 'US' },
    'en-CA': { country: 'Canada', countryCode: 'CA' },
    'en-GB': { country: 'United Kingdom', countryCode: 'GB' },
    'en-AU': { country: 'Australia', countryCode: 'AU' },
    'en-NZ': { country: 'New Zealand', countryCode: 'NZ' },
    'fr-FR': { country: 'France', countryCode: 'FR' },
    'fr-CA': { country: 'Canada', countryCode: 'CA' },
    'de-DE': { country: 'Germany', countryCode: 'DE' },
    'it-IT': { country: 'Italy', countryCode: 'IT' },
    'es-ES': { country: 'Spain', countryCode: 'ES' },
    'es-MX': { country: 'Mexico', countryCode: 'MX' },
    'pt-BR': { country: 'Brazil', countryCode: 'BR' },
    'pt-PT': { country: 'Portugal', countryCode: 'PT' },
    'ja-JP': { country: 'Japan', countryCode: 'JP' },
    'ko-KR': { country: 'South Korea', countryCode: 'KR' },
    'zh-CN': { country: 'China', countryCode: 'CN' },
    'zh-TW': { country: 'Taiwan', countryCode: 'TW' },
    'zh-HK': { country: 'Hong Kong', countryCode: 'HK' },
    'nl-NL': { country: 'Netherlands', countryCode: 'NL' },
    'sv-SE': { country: 'Sweden', countryCode: 'SE' },
    'no-NO': { country: 'Norway', countryCode: 'NO' },
    'da-DK': { country: 'Denmark', countryCode: 'DK' },
    'fi-FI': { country: 'Finland', countryCode: 'FI' }
  };
  
  return localeCountryMap[locale] || null;
}

export function getCountryFlag(countryCode: string): string {
  if (countryCode === 'UNKNOWN') return '🌍';
  
  const flagMap: Record<string, string> = {
    'US': '🇺🇸',
    'CA': '🇨🇦',
    'GB': '🇬🇧',
    'FR': '🇫🇷',
    'DE': '🇩🇪',
    'IT': '🇮🇹',
    'ES': '🇪🇸',
    'JP': '🇯🇵',
    'AU': '🇦🇺',
    'BR': '🇧🇷',
    'MX': '🇲🇽',
    'IN': '🇮🇳',
    'CN': '🇨🇳',
    'KR': '🇰🇷',
    'NL': '🇳🇱',
    'SE': '🇸🇪',
    'NO': '🇳🇴',
    'DK': '🇩🇰',
    'FI': '🇫🇮',
    'CH': '🇨🇭',
    'AT': '🇦🇹',
    'BE': '🇧🇪',
    'PT': '🇵🇹',
    'IE': '🇮🇪',
    'NZ': '🇳🇿',
    'SG': '🇸🇬',
    'HK': '🇭🇰',
    'TW': '🇹🇼',
    'TH': '🇹🇭',
    'MY': '🇲🇾',
    'PH': '🇵🇭',
    'ID': '🇮🇩',
    'VN': '🇻🇳',
    'ZA': '🇿🇦',
    'EG': '🇪🇬',
    'NG': '🇳🇬',
    'KE': '🇰🇪',
    'MA': '🇲🇦',
    'AR': '🇦🇷',
    'CL': '🇨🇱',
    'CO': '🇨🇴',
    'PE': '🇵🇪',
    'VE': '🇻🇪',
    'UY': '🇺🇾',
    'EC': '🇪🇨',
    'BO': '🇧🇴',
    'PY': '🇵🇾',
    'CR': '🇨🇷',
    'PA': '🇵🇦',
    'GT': '🇬🇹',
    'HN': '🇭🇳',
    'SV': '🇸🇻',
    'NI': '🇳🇮',
    'BZ': '🇧🇿',
    'JM': '🇯🇲',
    'TT': '🇹🇹',
    'BB': '🇧🇧',
    'GD': '🇬🇩',
    'LC': '🇱🇨',
    'VC': '🇻🇨',
    'DM': '🇩🇲',
    'AG': '🇦🇬',
    'KN': '🇰🇳',
    'BS': '🇧🇸',
    'CU': '🇨🇺',
    'DO': '🇩🇴',
    'HT': '🇭🇹',
    'PR': '🇵🇷'
  };
  
  return flagMap[countryCode] || '🌍';
}

export function getShippingMessage(userCountry: string, userCountryCode: string): string {
  const flag = getCountryFlag(userCountryCode);
  
  if (userCountryCode === 'US') {
    return `Ships within ${flag} United States`;
  } else if (userCountryCode === 'CA') {
    return `Ships to ${flag} Canada from 🇺🇸 United States`;
  } else if (userCountryCode === 'UNKNOWN') {
    return `Ships from 🇺🇸 United States`;
  } else {
    return `Ships to ${flag} ${userCountry} from 🇺🇸 United States`;
  }
}