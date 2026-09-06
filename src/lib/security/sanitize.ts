// HTML sanitization to prevent XSS
// Escapes dangerous characters and removes malicious content

/**
 * Sanitize HTML input by escaping dangerous characters
 * Prevents XSS attacks while preserving text content
 */
export function sanitizeHtml(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Remove HTML tags from input
 * Returns plain text content
 */
export function stripHtmlTags(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }
  return input.replace(/<[^>]*>/g, '');
}

/**
 * Escape special characters for regex patterns
 */
export function escapeRegex(text: string): string {
  if (typeof text !== 'string') {
    return '';
  }
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Validate email format
 * Basic RFC 5322 compliant validation
 */
export function isValidEmail(email: string): boolean {
  if (typeof email !== 'string') {
    return false;
  }
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Normalize and validate URL
 * Ensures safe URL format
 */
export function sanitizeUrl(url: string): string | null {
  if (typeof url !== 'string') {
    return null;
  }
  
  try {
    // Reject javascript: and data: URLs
    if (/^(javascript|data|vbscript):/i.test(url)) {
      return null;
    }
    
    // Ensure URL has a valid protocol
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    const urlObj = new URL(url);
    return urlObj.toString();
  } catch (e) {
    return null;
  }
}

/**
 * Truncate text to safe length
 * Prevents buffer overflow and storage issues
 */
export function truncateText(text: string, maxLength: number = 1000): string {
  if (typeof text !== 'string') {
    return '';
  }
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
}

/**
 * Generate safe identifier
 * Creates alphanumeric IDs for database keys
 */
export function generateSafeId(length: number = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);
  
  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length];
  }
  
  return result;
}

/**
 * Sanitize filename
 * Removes dangerous characters from filenames
 */
export function sanitizeFilename(filename: string): string {
  if (typeof filename !== 'string') {
    return 'file';
  }
  
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_+/g, '_')
    .substring(0, 255);
}

/**
 * Validate JSON string
 * Ensures valid JSON without injection risks
 */
export function validateJsonString(jsonString: string): boolean {
  if (typeof jsonString !== 'string') {
    return false;
  }
  
  try {
    const parsed = JSON.parse(jsonString);
    // Ensure it's not a function or constructor
    if (typeof parsed === 'function' || typeof parsed === 'undefined') {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Content Security Policy nonce generator
 * Creates cryptographically secure nonces for CSP
 */
export function generateCspNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Buffer.from(array).toString('base64');
}
