/**
 * @typedef {{err: null, data: T}} Data<T>
 * @template T
 */

/** @typedef {{err: string, data: null}} Err */

/**
 * @typedef {Err | Data<T>} ErrorOr<T>
 * @template T
 */

/**
 * @typedef {Promise<ErrorOr<T>>} AsyncErrorOr<T> The Promise should always resolves, never reject!
 * @template T
 */

/**
 * @typedef {{err: T, data: null}} SpecificErr<T>
 * @template {string} T
 */

/**
 * @typedef {SpecificErr<T>|Data<K>} SpecificErrorOr<T,K>
 * @template {string} T
 * @template K
 */

/**
 * @typedef {Promise<SpecificErrorOr<T,K>>} AsyncSpecificErrorOr<T,K> The Promise should always resolves, never reject!
 * @template {string} T
 * @template K
 */

/**
 * @typedef {{[key: string]: T}} LUT<T>
 * @template T
 */

/**
 * @typedef {false|T} FalseOr<T>
 * @template T
 */

/** @typedef {{[key: string]: ('boolean'|'number'|'string'|'object'|'array'|'null'|'any'|Schema)}} Schema */

/**
 * @template {Schema} S
 * @typedef {{[K in keyof S]: S[K] extends "boolean" ? boolean : S[K] extends "number" ? number : S[K] extends "string" ? string : S[K] extends "object" ? Object : S[K] extends "array" ? any[] : S[K] extends "null" ? null : S[K] extends "any" ? any : S[K] extends Schema ? Schema_T<S[K]> : never}} Schema_T
 */
