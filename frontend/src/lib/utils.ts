import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Recursively removes empty strings from an object, converting them to undefined.
 * This ensures optional fields with format validation (like URLs) don't fail
 * when they contain empty strings.
 *
 * @param obj - The object to clean
 * @returns A new object with empty strings replaced by undefined
 */
export function cleanEmptyStrings<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => cleanEmptyStrings(item)) as T;
  }

  if (typeof obj === 'object') {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value === '') {
        cleaned[key] = undefined;
      } else if (typeof value === 'object' && value !== null) {
        cleaned[key] = cleanEmptyStrings(value);
      } else {
        cleaned[key] = value;
      }
    }
    return cleaned;
  }

  return obj;
}
