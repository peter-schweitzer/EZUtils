/**
 * @typedef {{err: T, data: null}} Err<T>
 * @template {string} [T='']
 */

/**
 * @typedef {{err: null, data: T}} Data<T>
 * @template T
 */

/**
 * @typedef {Err<T>|Data<K>} ErrorOr<T,K>
 * @template {string} T
 * @template K
 */

/**
 * @typedef {Promise<ErrorOr<T,K>>} AsyncErrorOr<T,K> The Promise should always resolves, never reject!
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
