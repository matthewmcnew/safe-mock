import {ProxyMock, whenInTests, verifyInTests} from "./ProxyMock";

export interface Mocked {
    mocked: true;
}

export type MockedThing<T> = T & Mocked;


export interface ReturnSetter<T> {
    //noinspection ReservedWordAsName
    return(returnValue: T): void;
}

export interface verifier {
    <T extends () => any>(thing: MockedThing<T>): CallVerifierNoArgs

    <T extends (k: K) => any, K>(thing: MockedThing<T>): CallVerifier<K>

    <T extends (K: K, l: L) => any, K, L>(thing: MockedThing<T>): CallVerifier1<K, L>
}

interface CallVerifierNoArgs {
    called(): void
}

interface CallVerifier<K> {
    called(): void
    calledWith(k: K): void
}

interface CallVerifier1<K, L> {
    called(): void
    calledWith(k: K, l: L): void
}


export type Mock<T> = {
    [P in keyof T]: MockedThing<T[P]>
    }

export default class SafeMock {
    static build<T>(): Mock<T> {
        const mock: T = {} as any;
        let proxyMock: ProxyHandler<T> = new ProxyMock<T>();
        return new Proxy((mock as any), (proxyMock as any));
    }
}


export {whenInTests as when, verifyInTests as verify};
