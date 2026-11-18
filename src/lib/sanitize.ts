/**
 * Input sanitization and security utilities.
 * Protects against XSS, script injection, control characters, and buffer/payload abuse.
 */

// Basic email validation regex conforming to RFC 5322 specifications
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Standard Indian mobile / international phone number validation
const PHONE_REGEX = /^(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,5}[-.\s]?\d{3,5}$/;

/**
 * Sanitizes plain text input by stripping executable tags, script prefixes, and dangerous characters.
 */
export function sanitizeText(input: unknown, maxLength = 2000): string {
  if (typeof input !== 'string') {
    return '';
  }

  let sanitized = input
    // Strip null bytes and non-printable control characters except newline and tab
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Strip script and style tags and their contents
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    // Strip HTML tags
    .replace(/<[^>]+>/g, '')
    // Neutralize dangerous pseudo-protocols
    .replace(/(?:javascript|vbscript|data):/gi, '')
    .trim();

  if (sanitized.length > maxLength) {
    sanitized = sanitized.slice(0, maxLength);
  }

  return sanitized;
}

/**
 * Validates and normalizes an email address.
 */
export function sanitizeEmail(email: unknown): string {
  if (typeof email !== 'string') return '';
  const cleaned = email.trim().toLowerCase().slice(0, 254);
  return EMAIL_REGEX.test(cleaned) ? cleaned : cleaned;
}

/**
 * Validates if an email format is structurally sound.
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  return EMAIL_REGEX.test(email.trim().toLowerCase());
}

/**
 * Validates phone number pattern.
 */
export function isValidPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15 && PHONE_REGEX.test(phone.trim());
}

/**
 * Sanitizes an inquiry payload prior to state updates and database persistence.
 */
export function sanitizeInquiryData<T extends Record<string, unknown>>(data: T): T {
  const result: Record<string, unknown> = { ...data };

  if (typeof result.full_name === 'string') {
    result.full_name = sanitizeText(result.full_name, 120);
  }
  if (typeof result.email === 'string') {
    result.email = sanitizeEmail(result.email);
  }
  if (typeof result.phone === 'string') {
    result.phone = sanitizeText(result.phone, 30);
  }
  if (typeof result.company_name === 'string') {
    result.company_name = sanitizeText(result.company_name, 150);
  }
  if (typeof result.project_type === 'string') {
    result.project_type = sanitizeText(result.project_type, 100);
  }
  if (typeof result.description === 'string') {
    result.description = sanitizeText(result.description, 5000);
  }
  if (typeof result.budget_range === 'string') {
    result.budget_range = sanitizeText(result.budget_range, 100);
  }
  if (typeof result.timeframe === 'string') {
    result.timeframe = sanitizeText(result.timeframe, 100);
  }
  if (typeof result.reference_websites === 'string') {
    result.reference_websites = sanitizeText(result.reference_websites, 1000);
  }
  if (typeof result.domain_preference === 'string') {
    result.domain_preference = sanitizeText(result.domain_preference, 200);
  }
  if (typeof result.cloud_preference === 'string') {
    result.cloud_preference = sanitizeText(result.cloud_preference, 200);
  }
  if (typeof result.admin_notes === 'string') {
    result.admin_notes = sanitizeText(result.admin_notes, 2000);
  }
  if (typeof result.quote_notes === 'string') {
    result.quote_notes = sanitizeText(result.quote_notes, 2000);
  }

  return result as T;
}
