export const { log: LOG, table: TAB, warn: WRN, error: ERR } = console;

/**
 * @template {string} [T='']
 * @param {T} err
 * @param {EO_Obj<null>} [obj={}]
 * @returns {SpecificErr<T>}
 */
export function err(/** @type {T|''} */ err = '', obj = {}) {
  obj.err = err;
  obj.data = null;
  // @ts-ignore ts(2322) err and data are set correctly
  return obj;
}

/**
 * @template [T=null]
 * @param {T} data
 * @param {EO_Obj<T>} [obj={}]
 * @returns {Data<T>}
 */
export function data(/**@type {T|null}*/ data = null, obj = {}) {
  obj.err = null;
  obj.data = data;
  // @ts-ignore ts(2322) err and data are set correctly
  return obj;
}

/**
 * @template T
 * @param {Promise<T>} promise
 * @param {EO_Obj} [obj={}]
 * @returns {AsyncErrorOr<T>}
 */
export async function p2eo(promise, obj = {}) {
  try {
    return data(await promise, obj);
  } catch (e) {
    return err(typeof e === 'string' ? e : JSON.stringify(e), obj);
  }
}

/**
 * @param {any} obj
 * @returns {Schema_Primitive}
 */
function obj_to_schema_type(obj) {
  const t = typeof obj;

  if (t !== 'object') return t;
  else if (obj === null) return 'null';
  else if (Array.isArray(obj)) return 'array';
  else return t;
}

/**
 * @template {GenericObj} T
 * @template {Schema} S
 * @param {T} obj
 * @param {S} schema
 * @returns {obj is Schema_T<S>}
 */
export function validate(obj, schema) {
  for (const key in schema) {
    const t = obj_to_schema_type(obj[key]);

    if (!Object.hasOwn(obj, key)) return false;
    else if (schema[key] === 'any') continue;
    else if (typeof schema[key] === 'object')
      if (Array.isArray(schema[key]))
        if (schema[key].includes(t)) continue;
        else return false;
      else if (t === 'object' && validate(obj[key], schema[key])) continue;
      else return false;
    else if (t === schema[key]) continue;
    else return false;
  }

  return true;
}

/**
 * @template {Schema} S
 * @param {GenericObj} obj
 * @param {S} schema
 * @param {EO_Obj} eo_obj
 * @returns {ErrorOr<Schema_T<S>>}
 */
export function sanitize(obj, schema, eo_obj = {}) {
  /**@type {{[K in keyof S]: any}}*/
  //@ts-ignore ts(2322) sanitized will be hydrated properly before being returned (as type 'R')
  const sanitized = {};

  for (const key in schema) {
    if (!Object.hasOwn(obj, key)) return err(`obj doesn't have property '${key}'`, eo_obj);

    const t = obj_to_schema_type(obj[key]);
    const value = obj[key];
    const type = schema[key];

    if (type === 'any') sanitized[key] = value;
    else if (typeof type === 'object')
      if (Array.isArray(type))
        if (t in type) sanitized[key] = value;
        else return err(`type of '${key}' doesn't match schema, should be one of ${type.slice(0, -1).join(', ')} or ${type.at(-1)}`, eo_obj);
      else if (t === 'object') {
        const { err: e, data: s } = sanitize(value, type, eo_obj);
        if (e !== null) return err(`[${key}]\n  ${e}`, eo_obj);
        else sanitized[key] = s;
      } else return err(`type of '${key}' is not object`, eo_obj);
    else if (t === type) sanitized[key] = value;
    else return err(`type of '${key}' doesn't match schema, should be ${type}`, eo_obj);
  }

  return data(sanitized);
}

/** @param {string} [raw_str=""] */
export function escapeHTML(raw_str = '') {
  return raw_str.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

/** @param {string} [str=""] */
export function unescapeHTML(str = '') {
  return str.replaceAll('&quot;', '"').replaceAll('&gt;', '>').replaceAll('&lt;', '<').replaceAll('&amp;', '&');
}
