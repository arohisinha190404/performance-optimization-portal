import DOMPurify from 'dompurify';

/**
 * Treat all user-provided values as plain text. DOMPurify removes markup,
 * event handlers, and dangerous URL payloads before the value enters React state.
 */
export function sanitizeText(value) {
  return DOMPurify.sanitize(String(value ?? ''), {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  }).trim();
}
