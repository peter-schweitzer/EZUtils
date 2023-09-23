/**
 * @typedef {{err: string, data: null}} Err
 */

/**
 * @typedef {{err: null, data: T}} Data<T>
 * @template T
 */

/**
 * @typedef {Err|Data<T>} ErrorOr<T>
 * @template T
 */

/**
 * @typedef {Promise<ErrorOr<T>>} AsyncErrorOr<T> The Promise should always resolves, never reject!
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
