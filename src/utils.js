const { log: LOG, table: TAB, warn: WRN, error: ERR } = console;

/**
 * @param {T} [err='']
 * @param {Object} [obj={}]
 * @returns {SpecificErr<T>}
 * @template {string} [T='']
 */
function err(/**@type {T|''}*/ err = '', obj = {}) {
  return (obj.err = err), (obj.data = null), obj;
}

/**
 * @param {T} data
 * @param {Object} [obj={}]
 * @returns {Data<T>}
 * @template T
 */
function data(data = null, obj = {}) {
  return (obj.err = null), (obj.data = data), obj;
}

/**
 * @param {Promise<T>} promise
 * @returns {AsyncErrorOr<T>}
 * @template T
 */
async function p2eo(promise) {
  try {
    return Promise.resolve(data(await promise));
  } catch (e) {
    Promise.resolve(err(typeof e === 'string' ? e : JSON.stringify(e)));
  }
}

module.exports = { LOG, TAB, WRN, ERR, err, data, p2eo };
