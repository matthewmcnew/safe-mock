import {ProxyMock, whenInTests} from "./ProxyMock";

export interface Mocked {
    mocked: true;
}

export type MockedThing<T> = T & Mocked;


export interface ReturnSetter<T> {
    return(returnValue: T): void;
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

export {whenInTests as when};
