import {ReturnSetter, verifier} from "./SafeMock";
import CallsDontMatchError from "./CallsDontMatchError";

const _setReturnValue = Symbol('_setReturnValue');

export function whenInTests<T>(returnFromMock: T): ReturnSetter<T> {
    //noinspection ReservedWordAsName
    return {
        return(returnValue: T): void {
            (returnFromMock as any)[_setReturnValue](returnValue);
        }
    };
}


export const verifyInTests: verifier = (mockToVerify: any): any => {
    return mockToVerify.verifier;
};

class ValueIfNoReturnValueSet extends Error {
    constructor(propertyName: any, futureValueSetter: (returnValue: any) => void) {
        super(`MockReturn [${propertyName}] has No return value Set`);
        (this as any)[_setReturnValue] = futureValueSetter;
    }
}

class Verifier {
    constructor(private repo: ReturnValueMatcherRepo, private propertyKey: PropertyKey) {
    }

    //noinspection JSUnusedGlobalSymbols
    called() {
        const calls = this.repo.lookupCalls(this.propertyKey);

        const [callIfExisits] = calls.filter(call => call.length == 0);

        if (callIfExisits === undefined)
            throw new Error(`${this.propertyKey} was not called`)
    }

    //noinspection JSUnusedGlobalSymbols
    calledWith(...expectedArgs: any[]) {
        const calls = this.repo.lookupCalls(this.propertyKey);

        const [callIfExists] = calls
            .filter(expectedCall => JSON.stringify(expectedCall) === JSON.stringify(expectedArgs));

        if (callIfExists == undefined) {
            throw new CallsDontMatchError(expectedArgs, calls, this.propertyKey);
        }
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

interface CallMap {
    [key: string]: any[][];
}


class ReturnValueMatcherRepo {
    private map: ReturnValueMatcherMap = {};
    private callMap: CallMap = {};

    recordAndFindMatch(p: PropertyKey, argsToMatch: any[]): any | undefined {
        this.recordCall(p, argsToMatch);
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

    lookupCalls(propertyKey: PropertyKey): any[][] {
        return this.callMap[propertyKey] || [];
    }

    private recordCall(propertyKey: PropertyKey, argsToMatch: any[]) {
        this.callMap[propertyKey] = (this.callMap[propertyKey] || []);

        this.callMap[propertyKey].push(argsToMatch)
    }
}

export class ProxyMock<T> implements ProxyHandler<T> {

    private returnValueMatcherRepo: ReturnValueMatcherRepo = new ReturnValueMatcherRepo();

    constructor() {
    }

    get?(target: T, propertyKey: PropertyKey, receiver: any): any {

        const mockedFunc = (...argsToMatch: any[]) => {
            const matchingReturnValue = this.returnValueMatcherRepo.recordAndFindMatch(propertyKey, argsToMatch);

            if (matchingReturnValue)
                return matchingReturnValue;

            return new ValueIfNoReturnValueSet(propertyKey, (returnValue: any) => {
                this.returnValueMatcherRepo.setReturnValue(propertyKey, returnValue, argsToMatch);
            });
        };

        (mockedFunc as any).verifier = new Verifier(this.returnValueMatcherRepo, propertyKey);

        return mockedFunc;
    }
}
