const { log: LOG, table: TAB, warn: WRN, error: ERR } = console;

/**
 * @param {string} err
 * @returns {Err}
 */
function err(err = '') {
  return { err, data: null };
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
