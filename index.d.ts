export declare type WhenArgument<T> = SafeMockThing<(...args: any[]) => T> | T;

export declare interface When {
    <T>(promiseWhenArg: WhenArgument<Promise<T>>): PromiseReturnSetter<T>;

    <T>(whenArg: WhenArgument<T>): ReturnSetter<T>;
}

export interface ReturnSetter<T> {
    return(returnValue: T): void;
    throw(returnValue: any): void;
}

export interface PromiseReturnSetter<T> extends ReturnSetter<Promise<T>> {
    resolve(rejection: T): void;
    reject(rejection: any): void;
}

export declare interface verifierUnsafe {
    <T, K>(thing: SafeMockThing<(k: K) => T>): CallVerifier1<K>;
    // <T>(thing: SafeMockThing<() => T>): CallVerifierNoArgs;
}

export declare interface unsafeVerifier {
    (thing: SafeMockThing<any>): CallVerifierUnsafe;
}

export declare interface verifier {
    unsafe: unsafeVerifier;
    <T, K>(thing: SafeMockThing<(k: K) => T>): CallVerifier1<K>;
    <T>(thing: SafeMockThing<() => T>): CallVerifierNoArgs;
    <T, K, L>(thing: SafeMockThing<(k: K, l: L) => T>): CallVerifier2<K, L>;
    <T, K, L, J>(thing: SafeMockThing<(k: K, l: L, j: J) => T>): CallVerifier3<K, L, J>;
    <T, K, L, J, A>(thing: SafeMockThing<(k: K, l: L, j: J, a: A) => T>): CallVerifier4<K, L, J, A>;
    <T, K, L, J, A, B>(thing: SafeMockThing<(k: K, l: L, j: J, a: A, b: B) => T>): CallVerifier5<K, L, J, A, B>;
    <T, K, L, J, A, B, C>(thing: SafeMockThing<(k: K, l: L, j: J, a: A, b: B, c: C) => T>): CallVerifier6<K, L, J, A, B, C>;
    <T, K, L, J, A, B, C, D>(thing: SafeMockThing<(k: K, l: L, j: J, a: A, b: B, c: C, d: D) => T>): CallVerifier7<K, L, J, A, B, C, D>;
    <T, K, L, J, A, B, C, D, E>(thing: SafeMockThing<(k: K, l: L, j: J, a: A, b: B, c: C, d: D, e: E) => T>): CallVerifier8<K, L, J, A, B, C, D, E>;
    <T, K, L, J, A, B, C, D, E, F>(thing: SafeMockThing<(k: K, l: L, j: J, a: A, b: B, c: C, d: D, e: E, f: F) => T>): CallVerifier9<K, L, J, A, B, C, D, E, F>;
    <T, K, L, J, A, B, C, D, E, F, X>(thing: SafeMockThing<(k: K, l: L, j: J, a: A, b: B, c: C, d: D, e: E, f: F, x: X) => T>): CallVerifier10<K, L, J, A, B, C, D, E, F, X>;
}

export interface CallVerifierNoArgs {
    called(): void;
    times(k: number): any;
    never: CallVerifierNoArgs;
}
export interface CallVerifier1<K> {
    called(): void;
    calledWith(k: K): void;
    times(k: number): any;
    never: CallVerifier1<K>;
}
export interface CallVerifier2<K, L> {
    called(): void;
    calledWith(k: K, l: L): void;
    never: CallVerifier2<K, L>;
    times(k: number): any;
}
export interface CallVerifier3<K, L, J> {
    called(): void;
    calledWith(k: K, l: L, j: J): void;
    never: CallVerifier3<K, L, J>;
    times(k: number): any;
}
export interface CallVerifier4<K, L, J, A> {
    called(): void;
    calledWith(k: K, l: L, j: J, a: A): void;
    never: CallVerifier4<K, L, J, A>;
    times(k: number): any;
}
export interface CallVerifier5<K, L, J, A, B> {
    called(): void;
    calledWith(k: K, l: L, j: J, a: A, b: B): void;
    times(k: number): any;
    never: CallVerifier5<K, L, J, A, B>;
}
export interface CallVerifier6<K, L, J, A, B, C> {
    called(): void;
    calledWith(k: K, l: L, j: J, a: A, b: B, c: C): void;
    times(k: number): any;
    never: CallVerifier6<K, L, J, A, B, C>;
}
export interface CallVerifier7<K, L, J, A, B, C, D> {
    called(): void;
    calledWith(k: K, l: L, j: J, a: A, b: B, c: C, d: D): void;
    times(k: number): any;
    never: CallVerifier7<K, L, J, A, B, C, D>;
}
export interface CallVerifier8<K, L, J, A, B, C, D, E> {
    called(): void;
    calledWith(k: K, l: L, j: J, a: A, b: B, c: C, d: D, e: E): void;
    times(k: number): any;
    never: CallVerifier8<K, L, J, A, B, C, D, E>;
}
export interface CallVerifier9<K, L, J, A, B, C, D, E, F> {
    called(): void;
    calledWith(k: K, l: L, j: J, a: A, b: B, c: C, d: D, e: E, f: F): void;
    times(k: number): any;
    never: CallVerifier9<K, L, J, A, B, C, D, E, F>;
}
export interface CallVerifier10<K, L, J, A, B, C, D, E, F, X> {
    called(): void;
    calledWith(k: K, l: L, j: J, a: A, b: B, c: C, d: D, e: E, f: F, x: X): void;
    times(k: number): any;
    never: CallVerifier10<K, L, J, A, B, C, D, E, F, X>;
}

export interface CallVerifierUnsafe {
    called(): void;
    calledWith(...args: any[]): void;
    times(k: number): any;
    never: CallVerifierUnsafe;
}

export declare type SafeMockThing<T> = T & Mocked;
export declare type MockFunction<T extends Function> = T & Mocked;

export interface Mocked {
    mocked: true;
    resetMock(): void
}

export declare type resetable = {
    resetMock(): void
}

export declare type Mock<T> = {
    [P in keyof T]: SafeMockThing<T[P]>;
    } & resetable;

export declare type CallableMock<T extends Function> = MockFunction<T> & Mock<T>;

export declare interface SafeMockConstructor {

    build<T extends Function>(t?: {new(...args: any[]): T}): CallableMock<T>;
    build<T>(t?: {new(...args: any[]): T}): Mock<T>;

    mockFunction<T extends Function>(name?: string | T | undefined): MockFunction<T>;
}

export declare const when: When;
export declare const verify: verifier;
export declare const verifyUnsafe: verifierUnsafe;
export declare const SafeMock: SafeMockConstructor;
export default SafeMock;
