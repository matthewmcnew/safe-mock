import WhyReturnValueDidntMatch from "./WhyNoReturnValueMatched";
import _setStubbedActionNoArgs from "./_setStubbedActionNoArgsSymbol";
import {
    ReturnValueAction, ThrowingAction, RejectedPromiseAction, StubbedAction,
    ResolvedPromiseAction
} from "./StubbedActionMatcher";
import {when, PromiseReturnSetter} from "../index";

const _setReturnValue = Symbol('_setReturnValue');

export const whenInTests: when = <T>(whenArg: any): PromiseReturnSetter<T> => {
    if (whenArg[_setStubbedActionNoArgs]) {
        return new SafeMockReturnSetter(whenArg[_setStubbedActionNoArgs]);
    }

    if (whenArg[_setReturnValue] === undefined) {
        throw new Error("Whoops! Looks like you called `when` incorrectly. Make sure you create a Mock First!")
    }

    return new SafeMockReturnSetter(whenArg[_setReturnValue]);
};

class SafeMockReturnSetter<T> implements PromiseReturnSetter<T> {
    constructor(private stubbedActionSetter: (stubbedAction: StubbedAction) => void) {
    }

    resolve(resolvedValue: any): void {
        this.stubbedActionSetter(ResolvedPromiseAction.of(resolvedValue));
    }

    reject(rejection: any): void {
        this.stubbedActionSetter(RejectedPromiseAction.of(rejection));
    }

    return(returnValue: any): void {
        this.stubbedActionSetter(ReturnValueAction.of(returnValue));
    }

    throw(valueToThrow: any): void {
        this.stubbedActionSetter(ThrowingAction.of(valueToThrow));
    }
}


export function valueIfNoReturnValueSet(whyNoMatch: WhyReturnValueDidntMatch, futureReturnValueSetter: (returnValue: any) => void) {

    const notMockedYetExceptionThrower = function hasNotBeenMockedYet() {
        throw new Error(whyNoMatch.reasonAndAdvice());
    };

    class ValueIfNoReturnValueSet implements ProxyHandler<{}> {
        get?(target: {}, propertyKey: PropertyKey, receiver: any): any {
            if (propertyKey === _setStubbedActionNoArgs)
                return undefined;


            if (propertyKey === _setReturnValue) {
                return futureReturnValueSetter;
            }

            if (propertyKey === "toString") {
                return () => {
                    return whyNoMatch.reasonAndAdvice()
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
