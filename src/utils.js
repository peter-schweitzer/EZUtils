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
    return Promise.resolve(err(typeof e === 'string' ? e : JSON.stringify(e), obj));
  }
}

/**
 * @param {T} obj
 * @param {Schema} schema
 * @template {{}} T
 * @returns {boolean}
 */
export function validate(obj, schema) {
  for (const key in schema)
    if (!Object.hasOwn(obj, key)) return false;
    else if (typeof schema[key] === 'object')
      if (typeof obj[key] === 'object' && this.validate(obj[key], schema[key])) continue;
      else return false;
    else if (schema[key] === 'any' || schema[key] === typeof obj[key]) continue;
    else if (typeof obj[key] !== 'object') return false;
    else if (schema[key] === 'object') continue;
    else if (schema[key] === 'array')
      if (Array.isArray(obj[key])) continue;
      else return false;
    else if (schema[key] === 'null')
      if (obj[key] === null) continue;
      else return false;
    else return false;

  return true;
}

/**
 * @param {O} obj
 * @param {S} schema
 * @template {{}} O
 * @template {Schema} S
 * @template {{[K in keyof S & keyof O]: O[K]}} R
 * @returns {FalseOr<R>}
 */
export function sanitize(obj, schema) {
  /**@type {{[K in keyof S]: any}}*/
  //@ts-ignore ts(2322) sanitized will be hydrated properly before being returned (as type 'R')
  const sanitized = {};

  for (const key in schema) {
    if (!Object.hasOwn(obj, key)) return false;

    //@ts-ignore ts(2536) key can't not index a property of obj
    const value = obj[key];
    const type = schema[key];
    if (typeof type === 'object')
      if (typeof value === 'object' && (sanitized[key] = this.validate(value, type)) !== false) continue;
      else return false;
    else if (type === 'any' || type === typeof value) sanitized[key] = value;
    else if (typeof value !== 'object') return false;
    else if (type === 'object') sanitized[key] = value;
    else if (type === 'array')
      if (Array.isArray(value)) sanitized[key] = value;
      else return false;
    else if (type === 'null')
      if (value === null) sanitized[key] = value;
      else return false;
    else return false;
  }

  //@ts-expect-error ts(2322) sanitized has correct structure, has slightly different type annotation to avoid multiple other type errors
  return sanitized;
}
