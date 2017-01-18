import {ProxyMock, verifyInTests} from "./Proxy";
import {whenInTests} from "./valueIfNoReturnValueSet";

export interface ReturnSetter<T> {
    //noinspection ReservedWordAsName
    return(returnValue: T): void;
}

export interface verifier {
    <T>(thing: MockedThing<() => T>): CallVerifierNoArgs

    <T, K>(thing: MockedThing<(k: K) => T>): CallVerifier1<K>

    <T, K, L>(thing: MockedThing<(k: K, l: L) => T>): CallVerifier2<K, L>

    <T, K, L, J>(thing: MockedThing<(k: K, l: L, j: J) => T>): CallVerifier3<K, L, J>
    <T, K, L, J, A>(thing: MockedThing<(k: K, l: L, j: J, a: A) => T>): CallVerifier4<K, L, J, A>
    <T, K, L, J, A, B>(thing: MockedThing<(k: K, l: L, j: J, a: A, b: B) => T>): CallVerifier5<K, L, J, A, B>
    <T, K, L, J, A, B, C>(thing: MockedThing<(k: K, l: L, j: J, a: A, b: B, c: C) => T>): CallVerifier6< K, L, J, A, B, C>
    <T, K, L, J, A, B, C, D>(thing: MockedThing<(k: K, l: L, j: J, a: A, b: B, c: C, d: D) => T>): CallVerifier7<K, L, J, A, B, C, D>
    <T, K, L, J, A, B, C, D, E>(thing: MockedThing<(k: K, l: L, j: J, a: A, b: B, c: C, d: D, e: E) => T>): CallVerifier8<K, L, J, A, B, C, D, E>
    <T, K, L, J, A, B, C, D, E, F>(thing: MockedThing<(k: K, l: L, j: J, a: A, b: B, c: C, d: D, e: E, f: F) => T>): CallVerifier9<K, L, J, A, B, C, D, E, F>
    <T, K, L, J, A, B, C, D, E, F, X>(thing: MockedThing<(k: K, l: L, j: J, a: A, b: B, c: C, d: D, e: E, f: F, x: X) => T>): CallVerifier10<K, L, J, A, B, C, D, E, F, X>
}

export interface CallVerifierNoArgs {
    called(): void
}

export interface CallVerifier1<K> {
    calledWith(k: K): void
}

export interface CallVerifier2<K, L> {
    calledWith(k: K, l: L): void
}

export interface CallVerifier3<K, L, J> {
    calledWith(k: K, l: L, j: J): void
}

export interface CallVerifier4<K, L, J, A> {
    calledWith(k: K, l: L, j: J, a: A): void
}

export interface CallVerifier5<K, L, J, A, B> {
    calledWith(k: K, l: L, j: J, a: A, b: B): void
}

export interface CallVerifier6<K, L, J, A, B, C> {
    calledWith(k: K, l: L, j: J, a: A, b: B, c: C): void
}

export interface CallVerifier7<K, L, J, A, B, C, D> {
    calledWith(k: K, l: L, j: J, a: A, b: B, c: C, d: D): void
}

export interface CallVerifier8<K, L, J, A, B, C, D, E> {
    calledWith(k: K, l: L, j: J, a: A, b: B, c: C, d: D, e: E): void
}

export interface CallVerifier9<K, L, J, A, B, C, D, E, F> {
    calledWith(k: K, l: L, j: J, a: A, b: B, c: C, d: D, e: E, f: F): void
}

export interface CallVerifier10<K, L, J, A, B, C, D, E, F, X> {
    calledWith(k: K, l: L, j: J, a: A, b: B, c: C, d: D, e: E, f: F, x: X): void
}

export type MockedThing<T> = T & Mocked;

export interface Mocked {
    mocked: true;
}

export type Mock<T> = {
    [P in keyof T]: MockedThing<T[P]>
    }

const SafeMock = {
    build<T>(): Mock<T> {
        const mock: T = {} as any;
        let proxyMock: ProxyHandler<T> = new ProxyMock<T>();
        return new Proxy((mock as any), (proxyMock as any));
    }
};

export default SafeMock;
export {whenInTests as when, verifyInTests as verify};
