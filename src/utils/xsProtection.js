// ========================================
// XSS PROTECTION UTILITIES
// ========================================
// Required for safe HTML rendering from admin content

export const sanitizeHTML = (html) => {
  if (typeof html !== 'string') return '';
  
  // Remove dangerous script tags and content
  return html
    .replace(/<script.*?>.*?<\/script>/gi, '')
    .replace(/<iframe.*?>.*?<\/iframe>/gi, '')
    .replace(/<object.*?>.*?<\/object>/gi, '')
    .replace(/<embed.*?>.*?<\/embed>/gi, '')
    .replace(/<form.*?>.*?<\/form>/gi, '')
    .replace(/<input.*?>/gi, '')
    .replace(/<button.*?>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/<\s*\/?\s*script[^>]*>/gi, '')
    .replace(/<\s*\/?\s*iframe[^>]*>/gi, '')
    .replace(/<\s*\/?\s*object[^>]*>/gi, '')
    .replace(/<\s*\/?\s*embed[^>]*>/gi, '');
};

export const createSafeHTML = (html, fallback = '') => {
  const sanitized = sanitizeHTML(html);
  return sanitized || fallback;
};

export default {
  sanitizeHTML,
  createSafeHTML
};
