import {ReturnSetter} from "./SafeMock";

const _setReturnValue = Symbol('_setReturnValue');

export function whenInTests<T>(returnFromMock: T): ReturnSetter<T> {
    //noinspection ReservedWordAsName
    return {
        return(returnValue: T): void {
            (returnFromMock as any)[_setReturnValue](returnValue);
        }
    };
}

class ValueIfNoReturnValueSet extends Error {
    constructor(propertyName: any, futureValueSetter: (returnValue: any) => void) {
        super(`MockReturn [${propertyName}] has No return value Set`);
        (this as any)[_setReturnValue] = futureValueSetter;
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

class ReturnValueMatcherRepo {
    private map: ReturnValueMatcherMap = {};

    recordAndFindMatch(p: PropertyKey, argsToMatch: any[]): any | undefined {
        const returnValueMatchers = this.map[p] || [];

        const [firstMatchedMatcher] =
            returnValueMatchers
                .filter((matcher: ReturnValueMatcher) => matcher.match(argsToMatch));

        if (firstMatchedMatcher) {
            return firstMatchedMatcher.returnValue;
        } else {
            return undefined;
        }
    }

    setReturnValue(propertyKey: PropertyKey, returnValue: any, argsToMatch: any[]) {
        if (!this.map[propertyKey])
            this.map[propertyKey] = [];

        this.map[propertyKey].push(new ReturnValueMatcher(argsToMatch, returnValue));
    }
}

export class ProxyMock<T> implements ProxyHandler<T> {

    private returnValueMatcherRepo: ReturnValueMatcherRepo = new ReturnValueMatcherRepo();

    constructor() {
    }

    get?(target: T, propertyKey: PropertyKey, receiver: any): any {
        return (...argsToMatch: any[]) => {
            const matchingReturnValue = this.returnValueMatcherRepo.recordAndFindMatch(propertyKey, argsToMatch);

            if (matchingReturnValue)
                return matchingReturnValue;

            return new ValueIfNoReturnValueSet(propertyKey, (returnValue: any) => {
                this.returnValueMatcherRepo.setReturnValue(propertyKey, returnValue, argsToMatch);
            });
        };
    }
}
