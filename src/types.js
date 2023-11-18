/**
 * @typedef {{err: T, data: null}} SpecificErr<T>
 * @template {string} T
 */

/**
 * @typedef {SpecificErr<string>} Err
 */

/**
 * @typedef {{err: null, data: T}} Data<T>
 * @template T
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
 * @typedef {SpecificErrorOr<string, T>} ErrorOr<T>
 * @template T
 */

/**
 * @typedef {AsyncSpecificErrorOr<string,T>} AsyncErrorOr<T> The Promise should always resolves, never reject!
 * @template T
 */

/**
 * @typedef {{[key: string]: T}} LUT<T>
 * @template T
 */

/**
 * @typedef {false|T} FalseOr<T>
 * @template T
 */
