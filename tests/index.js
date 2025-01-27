import assert from 'node:assert';

import { ERR, LOG, ObjPool, TAB, WRN, data, err, escapeHTML, p2eo, unescapeHTML } from '../index.js';

const r = '\x1b[31;1m';
const g = '\x1b[32m';
const y = '\x1b[33m';
const e = '\x1b[0m';

//#region console
/**
 * @param {string} a
 * @param {string} b
 */
const assert_console_msg = (a, b) => `'${y}${a}()${e}' ${r}does not map to${e} '${y}${b}()${e}'`;

// this should only be necessary when ERR, LOG, TAB and WRN don't just map to the console functions
assert.equal(ERR, console.error, assert_console_msg('ERR', 'console.error'));
assert.equal(LOG, console.log, assert_console_msg('LOG', 'console.log'));
assert.equal(TAB, console.table, assert_console_msg('TAB', 'console.table'));
assert.equal(WRN, console.warn, assert_console_msg('WRN', 'console.warn'));
console.log(`${g}console functions passed${e}`);
//#endregion

//#region data/err
/** @param {string} a */
const assert_data_err_msg = (a) => `'${y}${a}${e}' ${r}returned an unexpected value${e}`;

assert.deepStrictEqual(data(), { err: null, data: null }, assert_data_err_msg('data()'));
assert.deepStrictEqual(err(), { err: '', data: null }, assert_data_err_msg('err()'));

assert.deepStrictEqual(data('test_data'), { err: null, data: 'test_data' }, assert_data_err_msg('data()'));
assert.deepStrictEqual(err('test_error'), { err: 'test_error', data: null }, assert_data_err_msg('err()'));

const data_err_test_obj = {};
assert(data(null, data_err_test_obj) === data_err_test_obj, assert_data_err_msg('data()'));
assert(err('', data_err_test_obj) === data_err_test_obj, assert_data_err_msg('err()'));
console.log(`${g}data and err functions passed${e}`);
//#endregion

//#region p2eo
/** @param {boolean} a */
const assert_p2eo_msg = (a) => `${y}p2eo<${a ? 'resolve' : 'reject'}>${e} ${r}returned an unexpected value${e}`;

assert.deepStrictEqual(await p2eo(Promise.resolve('test_async_data')), { err: null, data: 'test_async_data' }, assert_p2eo_msg(false));
assert.deepStrictEqual(await p2eo(Promise.reject('test_async_err')), { err: 'test_async_err', data: null }, assert_p2eo_msg(true));
console.log(`${g}p2eo function passed${e}`);
//#endregion

//#region (un)escapeHTML
/**
 * @param {string} a
 * @param {string} b
 * @param {boolean} c
 */
const assert_escape_msg = (a, b, c) => `${y}'${a}'${e} ${r}does not ${c ? 'un' : ''}escape to${e} ${y}'${b}'${e}`;

for (const [raw, esc] of [
  ['<script>alert("injected JS");</script>', '&lt;script&gt;alert(&quot;injected JS&quot;);&lt;/script&gt;'],
  ['&lt;&gt;', '&amp;lt;&amp;gt;'],
]) {
  assert.equal(escapeHTML(raw), esc, assert_escape_msg(raw, esc, false));
  assert.equal(unescapeHTML(esc), raw, assert_escape_msg(esc, raw, true));
}
console.log(`${g}escapeHTML function passed${e}`);
//#endregion

console.log('ObjPool:', ObjPool); // TODO: test ObjPool

console.log(`${g}all tests passed${e}`);
