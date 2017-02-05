import {ProxyMock, verifyInTests} from "./Proxy";
import {whenInTests} from "./valueIfNoReturnValueSet";
import {nameFunc} from "./functionNamer";
import {Mock, MockFunction, SafeMockConstructor} from "../index";

export const SafeMock: SafeMockConstructor = {
    build<T>(t?: T): Mock<T> {
        const mock: T = {} as any;
        let proxyMock: ProxyHandler<T> = new ProxyMock<T>();
        return new Proxy((mock as any), (proxyMock as any));
    },

    mockFunction<T extends Function>(name?: T | string): MockFunction<T> {
        let proxyMock: ProxyHandler<{}> = new ProxyMock<{}>();

        return proxyMock.get!({}, nameFunc(name), null);
    }
};

export {whenInTests as when, verifyInTests as verify};
export default SafeMock;
