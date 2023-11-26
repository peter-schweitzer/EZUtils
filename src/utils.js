export const { log: LOG, table: TAB, warn: WRN, error: ERR } = console;

/**
 * @param {T} [err='']
 * @param {Object} [obj={}]
 * @returns {SpecificErr<T>}
 * @template {string} [T='']
 */
export function err(/**@type {T|''}*/ err = '', obj = {}) {
  return (obj.err = err), (obj.data = null), obj;
}

/**
 * @param {T} data
 * @param {Object} [obj={}]
 * @returns {Data<T>}
 * @template T
 */
export function data(data = null, obj = {}) {
  return (obj.err = null), (obj.data = data), obj;
}

/**
 * @param {Promise<T>} promise
 * @param {Object} [obj={}]
 * @returns {AsyncErrorOr<T>}
 * @template T
 */
export async function p2eo(promise, obj = {}) {
  try {
    return Promise.resolve(data(await promise, obj));
  } catch (e) {
    Promise.resolve(err(typeof e === 'string' ? e : JSON.stringify(e), obj));
  }
}
