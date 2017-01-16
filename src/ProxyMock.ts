import {ReturnSetter} from "./SafeMock";

const _setReturnValue = Symbol('_setReturnValue');

export function whenInTests<T>(returnFromMock: T): ReturnSetter<T> {
    return {
        return(returnValue: T): void {
            (returnFromMock as any)[_setReturnValue](returnValue);
        }
    };
}

class ValueIfNoReturnValueSet {
    constructor(private propertyName: any, futureValueSetter: (returnValue: any) => void) {
        (this as any)[_setReturnValue] = futureValueSetter;
    }

    toString() {
        return `[MockReturn [${this.propertyName} has No return value Set]]`
    }
}

class ReturnValueMatcher {

    constructor(private argsToMatch: any[], public returnValue: any) {
    }

    match(possibleArgsToMatch: any[]) {
        return JSON.stringify(possibleArgsToMatch) === JSON.stringify(this.argsToMatch);
    }

}

interface ReturnValueMatcherMap {
    [key: string]: ReturnValueMatcher[];
}

export class ProxyMock<T> implements ProxyHandler<T> {

    _returnValueMatchersMap: ReturnValueMatcherMap = {};

    constructor() {
    }

    get?(target: T, p: PropertyKey, receiver: any): any {
        return (...argsToMatch: any[]) => {
            const setReturnValue = (returnValue: any) => {
                if (!this._returnValueMatchersMap[p])
                    this._returnValueMatchersMap[p] = [];

                this._returnValueMatchersMap[p].push(new ReturnValueMatcher(argsToMatch, returnValue));
            };

            const returnValueMatchers = this._returnValueMatchersMap[p];

            if (returnValueMatchers) {
                const [firstMatchedMatcher] =
                    returnValueMatchers
                        .filter((matcher: ReturnValueMatcher) => matcher.match(argsToMatch));

                if (firstMatchedMatcher)
                    return firstMatchedMatcher.returnValue;
            }

            return new ValueIfNoReturnValueSet(p, setReturnValue);
        };
    }
}
