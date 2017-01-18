import {verifier} from './SafeMock';
import CallsDontMatchError from './CallsDontMatchError';
import {valueIfNoReturnValueSet} from './valueIfNoReturnValueSet';
import WhyNoReturnValueMatched from './WhyNoReturnValueMatched';
import ReturnValueMatcher from './ReturnValueMatcher';
import LookupResult from './LookupResult';

export const verifyInTests: verifier = (mockToVerify: any): any => {
    return mockToVerify.verifier;
};


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

interface ReturnValueMatcherMap {
    [key: string]: ReturnValueMatcher[];
}

interface CallMap {
    [key: string]: any[][];
}


class ReturnValueMatcherRepo {
    private returnValueMatcherMap: ReturnValueMatcherMap = {};
    private callMap: CallMap = {};

    recordAndFindMatch(propertyKey: PropertyKey, argsToMatch: any[]): LookupResult {
        this.recordCall(propertyKey, argsToMatch);
        const returnValueMatchers = this.returnValueMatcherMap[propertyKey] || [];

        const [firstMatchedMatcher] =
            returnValueMatchers
                .filter((matcher: ReturnValueMatcher) => matcher.match(argsToMatch));

        if (firstMatchedMatcher) {
            return LookupResult.returnValueFound(firstMatchedMatcher.returnValue);
        } else {
            return LookupResult.noReturnValueMatched(
                new WhyNoReturnValueMatched(argsToMatch, returnValueMatchers, propertyKey)
            );
        }
    }

    setReturnValue(propertyKey: PropertyKey, returnValue: any, argsToMatch: any[]) {
        if (!this.returnValueMatcherMap[propertyKey])
            this.returnValueMatcherMap[propertyKey] = [];

        this.returnValueMatcherMap[propertyKey].push(new ReturnValueMatcher(argsToMatch, returnValue));
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
            const lookUpResult = this.returnValueMatcherRepo.recordAndFindMatch(propertyKey, argsToMatch);

            if (lookUpResult.returnFound)
                return lookUpResult.returnValue;

            return valueIfNoReturnValueSet(
                lookUpResult.whyNoReturnValueMatched,
                (returnValue: any) => this.returnValueMatcherRepo.setReturnValue(propertyKey, returnValue, argsToMatch)
            );
        };

        (mockedFunc as any).verifier = new Verifier(this.returnValueMatcherRepo, propertyKey);

        return mockedFunc;
    }
}
