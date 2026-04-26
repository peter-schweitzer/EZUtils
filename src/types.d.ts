export declare global {
  type EO_Obj<T = any> = { err?: string | null; data?: T | null };

  type Data<T> = { err: null; data: T };

  type Err = { err: string; data: null };
  type ErrorOr<T> = Err | Data<T>;
  /** The Promise should always resolves, never reject! */
  type AsyncErrorOr<T> = Promise<ErrorOr<T>>;

  type SpecificErr<T extends string> = { err: T; data: null };
  type SpecificErrorOr<T extends string, K> = SpecificErr<T> | Data<K>;
  /** The Promise should always resolves, never reject! */
  type AsyncSpecificErrorOr<T extends string, K> = Promise<SpecificErrorOr<T, K>>;

  type FalseOr<T> = false | T;
  type LUT<T> = { [key: string]: T };
  type GenericObj = LUT<any>;

  type ArrayToUnion<A extends Array<infer T>> = A[number];

  type Schema_Primitive = 'boolean' | 'number' | 'string' | 'undefined' | 'function' | 'bigint' | 'symbol' | 'array' | 'null' | 'object';
  type Schema_Primitive_T<P extends Schema_Primitive> =
    P extends 'boolean' ? boolean
    : P extends 'number' ? number
    : P extends 'string' ? string
    : P extends 'undefined' ? undefined
    : P extends 'function' ? (...a: any[]) => any
    : P extends 'bigint' ? bigint
    : P extends 'symbol' ? symbol
    : P extends 'array' ? any[]
    : P extends 'null' ? null
    : P extends 'object' ? GenericObj
    : never;

  type Schema = { [key: string]: 'any' | Schema_Primitive | Schema_Primitive[] | Schema };
  type Schema_T<S extends Schems> = {
    [K in keyof S]: S[K] extends 'any' ? any
    : S[K] extends Schema_Primitive ? Schema_Primitive_T<S[K]>
    : S[K] extends Schema_Primitive[] ? Schema_Primitive_T<ArrayToUnion<S[K]>>
    : S[K] extends Schema ? Schema_T<S[K]>
    : never;
  };
}
