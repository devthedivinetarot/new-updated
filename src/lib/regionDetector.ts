export type UserRegion = 'india' | 'global';

const INDIAN_TIMEZONES = [
  'Asia/Kolkata',
  'Asia/Calcutta',
  'Asia/Colombo',
];

const INDIAN_CURRENCIES = ['INR', '₹'];

interface RegionInfo {
  region: UserRegion;
  currency: string;
  currencySymbol: string;
  timeZone: string;
}

export function detectRegionFromTimezone(): UserRegion {
  if (typeof window === 'undefined') {
    return 'global';
  }
  
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    if (INDIAN_TIMEZONES.some(tz => timeZone.includes(tz.replace('Asia/', '')))) {
      return 'india';
    }
    
    if (timeZone.includes('Kolkata') || timeZone.includes('Calcutta')) {
      return 'india';
    }
  } catch (e) {
    console.log('[Region] Timezone detection failed:', e);
  }
  
  return 'global';
}

export function detectRegionFromLocale(): UserRegion {
  if (typeof window === 'undefined') {
    return 'global';
  }
  
  try {
    const locale = navigator.language || navigator.languages?.[0] || 'en';
    
    if (locale.startsWith('en-IN') || locale.startsWith('hi')) {
      return 'india';
    }
    
    const regionPart = locale.split('-')[1];
    if (regionPart === 'IN') {
      return 'india';
    }
  } catch (e) {
    console.log('[Region] Locale detection failed:', e);
  }
  
  return 'global';
}

export function getRegionalPricing(region: UserRegion): {
  monthly: number;
  yearly: number;
  currency: string;
  symbol: string;
} {
  if (region === 'india') {
    return {
      monthly: 199,
      yearly: 1999,
      currency: 'INR',
      symbol: '₹',
    };
  }
  
  return {
    monthly: 4.99,
    yearly: 49.99,
    currency: 'USD',
    symbol: '$',
  };
}

export function getRegionalCurrency(region: UserRegion): { 
  code: string; 
  symbol: string;
} {
  if (region === 'india') {
    return { code: 'INR', symbol: '₹' };
  }
  return { code: 'USD', symbol: '$' };
}

export function formatPrice(price: number, region: UserRegion): string {
  const { symbol } = getRegionalCurrency(region);
  
  if (region === 'india') {
    return `${symbol}${price}`;
  }
  
  return `${symbol}${price.toFixed(2)}`;
}

export const REGION_STORAGE_KEY = 'divine_tarot_region';

export function getStoredRegion(): UserRegion | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REGION_STORAGE_KEY) as UserRegion | null;
}

export function setStoredRegion(region: UserRegion): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(REGION_STORAGE_KEY, region);
}

export async function detectRegion(): Promise<UserRegion> {
  const stored = getStoredRegion();
  if (stored) {
    return stored;
  }
  
  let region = detectRegionFromTimezone();
  
  if (region === 'global') {
    region = detectRegionFromLocale();
  }
  
  setStoredRegion(region);
  return region;
}

export function getRegionInfo(): RegionInfo {
  const region = typeof window !== 'undefined' 
    ? (getStoredRegion() || detectRegionFromTimezone())
    : 'global';
  
  const { code, symbol } = getRegionalCurrency(region);
  
  return {
    region,
    currency: code,
    currencySymbol: symbol,
    timeZone: 'Asia/Kolkata',
  };
}