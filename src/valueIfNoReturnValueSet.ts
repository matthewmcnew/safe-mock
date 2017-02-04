import {ReturnSetter, MockedThing} from './SafeMock';
import WhyReturnValueDidntMatch from './WhyNoReturnValueMatched';
import _setStubbedActionNoArgs from "./_setStubbedActionNoArgsSymbol";
import {ReturnValueAction, ThrowingAction} from "./StubbedActionMatcher";

const _setReturnValue = Symbol('_setReturnValue');

type MockedFunction<T> = (...args: any[]) => T;
type WhenArgument<T> = MockedThing<MockedFunction<T>> | T;

export function whenInTests<T>(whenArg: WhenArgument<T>): ReturnSetter<T> {
    if ((<any>whenArg)[_setStubbedActionNoArgs]) {
        //noinspection ReservedWordAsName
        return {
            return(returnValue: T): void {
                (<any>whenArg)[_setStubbedActionNoArgs](ReturnValueAction.of(returnValue));
            },

            throw(valueToThrow: any): void {
                (<any>whenArg)[_setStubbedActionNoArgs](ThrowingAction.of(valueToThrow));
            }
        };
    }

    if((whenArg as any)[_setReturnValue] === undefined){
        throw new Error("Whoops! Looks like you called `when` incorrectly. Make sure you create a Mock First!")
    }

    //noinspection ReservedWordAsName
    return {
        return(returnValue: T): void {
            (whenArg as any)[_setReturnValue](ReturnValueAction.of(returnValue));
        },

        throw(valueToThrow: any): void {
            (whenArg as any)[_setReturnValue](ThrowingAction.of(valueToThrow));
        }
    };
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
