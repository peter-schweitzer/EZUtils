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

  type Schema = { [key: string]: 'boolean' | 'number' | 'string' | 'object' | 'array' | 'null' | 'any' | Schema };
  type Schema_T<S extends Schems> = {
    [K in keyof S]: S[K] extends 'boolean' ? boolean
    : S[K] extends 'number' ? number
    : S[K] extends 'string' ? string
    : S[K] extends 'object' ? Object
    : S[K] extends 'array' ? any[]
    : S[K] extends 'null' ? null
    : S[K] extends 'any' ? any
    : S[K] extends Schema ? Schema_T<S[K]>
    : never;
  };
}
