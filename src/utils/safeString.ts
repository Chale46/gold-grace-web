/**
 * Safe string utilities to prevent TypeError: Cannot read properties of undefined (reading 'includes')
 */

/**
 * Convert any value to safe string
 * @param v - any value
 * @returns string (empty string if not a string)
 */
export const safeStr = (v: unknown): string =>
  typeof v === 'string' ? v : '';

/**
 * Safe includes check
 * @param v - value to search in
 * @param q - query string to search for
 * @returns boolean
 */
export const safeIncludes = (v: unknown, q: string): boolean =>
  safeStr(v).includes(q);

/**
 * Safe toLowerCase
 * @param v - value to lowercase
 * @returns lowercase string
 */
export const safeLower = (v: unknown): string =>
  safeStr(v).toLowerCase();

/**
 * Safe toUpperCase
 * @param v - value to uppercase
 * @returns uppercase string
 */
export const safeUpper = (v: unknown): string =>
  safeStr(v).toUpperCase();

/**
 * Safe trim
 * @param v - value to trim
 * @returns trimmed string
 */
export const safeTrim = (v: unknown): string =>
  safeStr(v).trim();
