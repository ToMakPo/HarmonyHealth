/** Extracts the type of elements in an array type or returns the type itself if not an array. */
export type ElementType<T> = T extends (infer U)[] ? U : T;

/** Makes specified keys in the type optional. */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** Makes specified keys in the type required. */
export type Required<T, K extends keyof T> = T & { [P in K]-?: T[P] };

/** Makes specified keys in the type nullable. */
export type Nullable<T, K extends keyof T> = Omit<T, K> & { [P in K]: T[P] | null };

/** Makes specified keys in the type queryable as single value or array of values.
 * If orriginaly an array, then it allows single value of the array element type as well. */
export type Queryable<T, K extends keyof T> = Omit<T, K> & { [P in K]: T[P] | (T[P] extends (infer U)[] ? U : T[P])[] };

/** Adds a min and max range for specified keys in the type. (ex. if K = cost, then there will be cost, but also, minCost and maxCost) */
export type Ranged<T, K extends keyof T> = T & { [P in K as `min${Capitalize<string & P>}`]?: T[P]; } & { [P in K as `max${Capitalize<string & P>}`]?: T[P]; };

/** Flattens a nested object T into a single level object with keys prefixed by Prefix. */
export type Flatten<T, Prefix extends string> = T extends any[]
    ? T extends (infer U)[]
        ? U extends object
            ? { [K in keyof U as `${Prefix}_${string & K}`]: U[K] }
            : never
        : never
    : T extends object
        ? { [K in keyof T as `${Prefix}_${string & K}`]: T[K] }
        : never;

/** Flattens specified child objects in T based on the mapping K. */
export type FlattenChild<T, K extends Partial<Record<keyof T, string>> = {}> = Omit<T, keyof K> & UnionToIntersection<{
    [P in keyof K]: P extends keyof T ? Flatten<T[P], K[P] & string> : never
}[keyof K]>;

/** Helper type to convert a union to an intersection */
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

// TODO: Remove this example code when done testing.
// interface Address {
//     street: string;
//     city: string;
//     zipCode: number;
// }

// interface ContactInfo {
//     email: string;
//     phone: string;
// }

// interface Company {
//     id: number;
//     name: string;
//     address: Address;
//     contacts: ContactInfo[];
// 	age: number;
// }

// type FlatCompany = FlattenChild<Company, {'address': 'addr', 'contacts': 'contact'}>

// type Test = Ranged<Company, 'age'>