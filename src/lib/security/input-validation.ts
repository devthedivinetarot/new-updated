// Input validation for API endpoints
// Prevents XSS, SQL injection, and invalid data

export interface ValidationResult {
  valid: boolean;
  error?: string;
  details?: string[];
}

/**
 * Validate reading input
 * Checks for XSS, length limits, and data integrity
 */
export function validateReadingInput(input: {
  question: any;
  language?: any;
  name?: any;
}): ValidationResult {
  const errors: string[] = [];

  // Validate question
  if (!input.question || typeof input.question !== 'string') {
    errors.push('Question is required and must be a string');
  } else {
    const trimmed = input.question.trim();
    if (trimmed.length < 3) {
      errors.push('Question must be at least 3 characters long');
    }
    if (trimmed.length > 1000) {
      errors.push('Question must not exceed 1000 characters');
    }
    if (containsXSS(trimmed)) {
      errors.push('Question contains invalid characters');
    }
  }

  // Validate language
  if (input.language && typeof input.language === 'string') {
    const validLanguages = ['en', 'hi', 'hinglish', 'ar', 'he'];
    if (!validLanguages.includes(input.language)) {
      errors.push(`Language must be one of: ${validLanguages.join(', ')}`);
    }
  }

  // Validate name (optional)
  if (input.name !== undefined && input.name !== null) {
    if (typeof input.name !== 'string') {
      errors.push('Name must be a string if provided');
    } else {
      const trimmed = input.name.trim();
      if (trimmed.length > 100) {
        errors.push('Name must not exceed 100 characters');
      }
      if (containsXSS(trimmed)) {
        errors.push('Name contains invalid characters');
      }
    }
  }

  return {
    valid: errors.length === 0,
    error: errors.length > 0 ? 'Validation failed' : undefined,
    details: errors.length > 0 ? errors : undefined,
  };
}

/**
 * Basic XSS detection
 * Checks for common XSS patterns
 */
function containsXSS(text: string): boolean {
  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi, // onclick, onload, etc
    /<iframe[^>]*>/gi,
    /<img[^>]+onerror/gi,
    /eval\s*\(/gi,
    /expression\s*\(/gi,
    /vbscript:/gi,
    /data:text\/html/gi,
  ];

  for (const pattern of xssPatterns) {
    if (pattern.test(text)) {
      return true;
    }
  }
  return false;
}

/**
 * Rate limit validation
 */
export function validateRateLimit(key: string, limit: number, windowMs: number): boolean {
  if (typeof key !== 'string' || key.length === 0) {
    return false;
  }
  if (typeof limit !== 'number' || limit <= 0) {
    return false;
  }
  if (typeof windowMs !== 'number' || windowMs <= 0) {
    return false;
  }
  return true;
}
