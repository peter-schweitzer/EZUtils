import { LOG, WRN } from './utils.js';

export class ObjPool {
  /** @type {{}[]} */
  #pool;

  /** @type {number} */
  #batch_size;

  /** @type {boolean} */
  #VERBOSE;

  #ObjProto = Object.getPrototypeOf({});

  /**
   * @param {number} [batchSize=8]
   * @param {boolean} [VERBOSE=false]
   */
  constructor(batchSize = 8, VERBOSE = false) {
    this.#batch_size = batchSize;
    this.#VERBOSE = VERBOSE;

    this.#VERBOSE && LOG('batch size:', batchSize);

    this.#pool = new Array(batchSize);
    for (let i = 0; i < this.#pool.length; i++) this.#pool[i] = {};
  }

  #grow() {
    this.#VERBOSE && LOG(`grow (adding ${this.#batch_size} objects to pool)`);
    for (let i = 0; i < this.#batch_size; i++) this.#pool.push({});
  }

  /** @returns {Object} */
  take() {
    if (this.#pool.length === 0) this.#grow();
    this.#VERBOSE && LOG(`take (${this.#pool.length} available, ${this.#pool.length - 1} remaining)`);
    return this.#pool.pop();
  }

  /**
   * @param {Object} obj
   * @param {boolean} [UNSAFE_DO_NOT_SCRUB_FLAG=false] if set to true, the object will not be scrubbed (may leak data to other users of the Pool!!!)
   * @returns {FalseOr<number>}
   */
  release(obj, UNSAFE_DO_NOT_SCRUB_FLAG = false) {
    if (!Object.isExtensible(obj)) return this.#VERBOSE && WRN("object is not extensible (may be frozen or sealed) and can't be released into the data pool"), false;

    Object.setPrototypeOf(obj, this.#ObjProto);

    if (!UNSAFE_DO_NOT_SCRUB_FLAG) for (const k in Object.keys(obj)) delete obj[k];

    if (this.#VERBOSE)
      if (UNSAFE_DO_NOT_SCRUB_FLAG) WRN(`release (${this.#pool.length + 1} available)`, '\x1b[38;2;255;0;0;1mUNSAFE_DO_NOT_SCRUB_FLAG is set\x1b[0m');
      else LOG(`release (${this.#pool.length + 1} available)`);

    return this.#pool.push(obj);
  }
}
