const { log: LOG, table: TAB, warn: WRN, error: ERR } = console;

/**
 * @param {T} [err='']
 * @returns {Err<T>}
 * @template {string} [T='']
 */
function err(/**@type {T|''}*/ err = '') {
  return { err: /**@type {T}*/ (err), data: null };
}

/**
 * @param {T} data
 * @returns {Data<T>}
 * @template T
 */
function data(data = null) {
  return { err: null, data };
}

/**
 * @param {Promise<T>} promise
 * @returns {AsyncErrorOr<string, T>}
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
