import {ReturnSetter} from './SafeMock';

const _setReturnValue = Symbol('_setReturnValue');

export function whenInTests<T>(returnFromMock: T): ReturnSetter<T> {
    //noinspection ReservedWordAsName
    return {
        return(returnValue: T): void {
            (returnFromMock as any)[_setReturnValue](returnValue);
        }
    };
}

export function valueIfNoReturnValueSet(propertyName: any, futureReturnValueSetter: (returnValue: any) => void) {

    const notMockedYetExceptionThrower = function hasNotBeenMockedYet() {
        throw new Error(`${propertyName} has not been mocked yet. Set a mock return value for it.`);
    };

    class ValueIfNoReturnValueSet implements ProxyHandler<{}> {
        get?(target: {}, propertyKey: PropertyKey, receiver: any): any {
            if (propertyKey === _setReturnValue) {
                return futureReturnValueSetter;
            }

            if (propertyKey === "toString") {
                return () => {
                    return `MockReturn [${propertyName}] has No return value Set. Set a mock return value for it.`
                };
            }

            return notMockedYetExceptionThrower();
        }

        set?(target: {}, p: PropertyKey, value: any, receiver: any): boolean {
            notMockedYetExceptionThrower();
            return false;
        }


        getPrototypeOf(target: {}): any {
            return notMockedYetExceptionThrower();

        }

        setPrototypeOf(target: {}, v: any): boolean {
            return notMockedYetExceptionThrower();
        }

        isExtensible(target: {}): boolean {
            return notMockedYetExceptionThrower();
        }

        preventExtensions(target: {}): boolean {
            return notMockedYetExceptionThrower();
        }

        getOwnPropertyDescriptor(target: {}, p: PropertyKey): PropertyDescriptor {
            return notMockedYetExceptionThrower();
        }

        has(target: {}, p: PropertyKey): boolean {
            return notMockedYetExceptionThrower();
        }

        deleteProperty(target: {}, p: PropertyKey): boolean {
            return notMockedYetExceptionThrower();
        }

        defineProperty(target: {}, p: PropertyKey, attributes: PropertyDescriptor): boolean {
            return notMockedYetExceptionThrower();
        }

        enumerate(target: {}): PropertyKey[] {
            return notMockedYetExceptionThrower();
        }

        ownKeys(target: {}): PropertyKey[] {
            return notMockedYetExceptionThrower();
        }

        apply(target: {}, thisArg: any, argArray?: any): any {
            return notMockedYetExceptionThrower();
        }

        construct(target: {}, thisArg: any, argArray?: any): any {
            return notMockedYetExceptionThrower();
        }
    }

    return new Proxy(notMockedYetExceptionThrower, new ValueIfNoReturnValueSet());
}
