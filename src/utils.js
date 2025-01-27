export const { log: LOG, table: TAB, warn: WRN, error: ERR } = console;

/**
 * @param {T} [err='']
 * @param {Object} [obj={}]
 * @returns {SpecificErr<T>}
 * @template {string} [T='']
 */
export function err(/**@type {T|''}*/ err = '', obj = {}) {
  obj.err = err;
  obj.data = null;
  return obj;
}

/**
 * @param {T} data
 * @param {Object} [obj={}]
 * @returns {Data<T>}
 * @template T
 */
export function data(data = null, obj = {}) {
  obj.err = null;
  obj.data = data;
  return obj;
}

/**
 * @param {Promise<T>} promise
 * @param {Object} [obj={}]
 * @returns {AsyncErrorOr<T>}
 * @template T
 */
export async function p2eo(promise, obj = {}) {
  try {
    return data(await promise, obj);
  } catch (e) {
    return err(typeof e === 'string' ? e : JSON.stringify(e), obj);
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
      if (
        typeof obj[key] === 'object' &&
        // @ts-ignore
        validate(obj[key], schema[key])
      )
        continue;
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
 * @param {any} eo_obj
 * @template {{}} O
 * @template {Schema} S
 * @template {{[K in keyof S & keyof O]: O[K]}} R
 * @returns {ErrorOr<R>}
 */
export function sanitize(obj, schema, eo_obj) {
  /**@type {{[K in keyof S]: any}}*/
  //@ts-ignore ts(2322) sanitized will be hydrated properly before being returned (as type 'R')
  const sanitized = {};

  for (const key in schema) {
    if (!Object.hasOwn(obj, key)) return err(`obj doesn't have property '${key}'`, eo_obj);

    //@ts-ignore ts(2536) key can't not index a property of obj
    const value = obj[key];
    const type = schema[key];
    if (typeof type === 'object')
      if (typeof value === 'object') {
        const { err: e, data: s } = sanitize(value, type, eo_obj);
        if (e !== null) return err(`[${key}]\n  ${e}`, eo_obj);
        else sanitized[key] = s;
      } else return err(`type of '${key}' should be object`, eo_obj);
    else if (type === 'any' || type === typeof value) sanitized[key] = value;
    else if (typeof value !== 'object') return err(`type of '${key}' is not object`, eo_obj);
    else if (type === 'object') sanitized[key] = value;
    else if (type === 'array')
      if (Array.isArray(value)) sanitized[key] = value;
      else return err(`type of '${key}' is not Array`, eo_obj);
    else if (type === 'null')
      if (value === null) sanitized[key] = value;
      else return err(`type of '${key}' is not null`, eo_obj);
    else return err(`type of '${key}' has invalid type in schema`, eo_obj);
  }

  //@ts-expect-error ts(2322) sanitized has correct structure, has slightly different type annotation to avoid multiple other type errors
  return sanitized;
}

/** @param {string} [raw_str=""] */
export function escapeHTML(raw_str = '') {
  return raw_str.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

/** @param {string} [str=""] */
export function unescapeHTML(str = '') {
  return str.replaceAll('&quot;', '"').replaceAll('&gt;', '>').replaceAll('&lt;', '<').replaceAll('&amp;', '&');
}
