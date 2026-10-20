import { FieldValue } from 'firebase-admin/firestore';

// Centralized Firestore utility for stripping undefined properties and normalizing metadata payloads.

/**
 * Recursively strips undefined properties from an object or array to ensure
 * compatibility with Firestore document writes, preventing "Cannot use undefined as a Firestore value" errors.
 * Preserves null, false, 0, empty strings, Date objects, and primitive values.
 */
export function normalizeForFirestore<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj
      .map((item) => normalizeForFirestore(item))
      .filter((item) => item !== undefined) as unknown as T;
  }

  if (typeof obj === 'object' && !(obj instanceof Date)) {
    const cleaned: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      if (value !== undefined) {
        const cleanedVal = normalizeForFirestore(value);
        if (cleanedVal !== undefined) {
          cleaned[key] = cleanedVal;
        }
      }
    }
    return cleaned as T;
  }

  return obj;
}

/**
 * Canonical helper to normalize media metadata specifically before persisting to Firestore.
 */
export function normalizeMediaMetadata<T extends Record<string, unknown>>(metadata: T): T {
  return normalizeForFirestore(metadata);
}

// Removes retired keys from an in-memory document so APIs never echo leftover Firestore fields.
export function omitRetiredFields<T extends Record<string, unknown>>(
  raw: T,
  retiredKeys: readonly string[]
): T {
  const next = { ...raw };
  for (const key of retiredKeys) {
    delete next[key];
  }
  return next;
}

// True when a Firestore snapshot still contains keys that no longer belong on the document.
export function hasRetiredFields(raw: Record<string, unknown>, retiredKeys: readonly string[]): boolean {
  return retiredKeys.some((key) => Object.prototype.hasOwnProperty.call(raw, key));
}

// Builds FieldValue.delete() payloads so leftover keys are removed on the next write.
export function retiredFieldDeletes(retiredKeys: readonly string[]): Record<string, FieldValue> {
  const deletes: Record<string, FieldValue> = {};
  for (const key of retiredKeys) {
    deletes[key] = FieldValue.delete();
  }
  return deletes;
}
