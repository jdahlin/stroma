/**
 * Branded type for creating nominal types.
 * Prevents accidental mixing of IDs from different domains.
 */
export type Brand<T, B> = T & { readonly __brand: B };

/**
 * Make specific properties optional.
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Make specific properties required.
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/**
 * Extract the resolved type from a Promise.
 */
export type Awaited<T> = T extends Promise<infer U> ? U : T;

/**
 * A function that takes no arguments and returns void.
 */
export type VoidFn = () => void;

/**
 * A function that takes no arguments and returns a Promise<void>.
 */
export type AsyncVoidFn = () => Promise<void>;
