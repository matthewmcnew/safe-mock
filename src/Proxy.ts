import {verifier} from './SafeMock';
import CallsDontMatchError from './CallsDontMatchError';
import {valueIfNoReturnValueSet} from './valueIfNoReturnValueSet';
import WhyNoReturnValueMatched from './WhyNoReturnValueMatched';
import ReturnValueMatcher from './ReturnValueMatcher';
import LookupResult from './LookupResult';
import ArgumentInvocation from "./ArgumentInvocation";
import AnyArgsMatch from "./AnyArgsMatch";
import _setReturnValueNoArgs from "./_setReturnValueNoArgsSymbol";
import {ArgumentInvocationMatcher} from "./ReturnValueMatcher";

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
        const expectedArgumentInvocation = new ArgumentInvocation(expectedArgs);

        const calls = this.repo.lookupCalls(this.propertyKey);

        const [callIfExists] = calls
            .filter(expectedCall => expectedArgumentInvocation.equivalentTo(expectedCall));

        if (callIfExists == undefined) {
            throw new CallsDontMatchError(expectedArgumentInvocation, calls, this.propertyKey);
        }
    }
}

class ReturnValueMatcherRepo {
    private returnValueMatcherMap: Record<string, ReturnValueMatcher[]> = {};
    private callMap: Record<string, ArgumentInvocation[]> = {};

    recordAndFindMatch(propertyKey: PropertyKey, argsToMatch: ArgumentInvocation): LookupResult {
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

    setReturnValue(propertyKey: PropertyKey, returnValue: any, argsToMatch: ArgumentInvocationMatcher) {
        if (!this.returnValueMatcherMap[propertyKey])
            this.returnValueMatcherMap[propertyKey] = [];

        this.returnValueMatcherMap[propertyKey].push(new ReturnValueMatcher(argsToMatch, returnValue));
    }

    lookupCalls(propertyKey: PropertyKey): ArgumentInvocation[] {
        return this.callMap[propertyKey] || [];
    }

    private recordCall(propertyKey: PropertyKey, argsToMatch: ArgumentInvocation) {
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
            const lookUpResult = this.returnValueMatcherRepo.recordAndFindMatch(propertyKey, new ArgumentInvocation(argsToMatch));

            if (lookUpResult.returnFound)
                return lookUpResult.returnValue;

            return valueIfNoReturnValueSet(
                lookUpResult.whyNoReturnValueMatched,
                (returnValue: any) => this.returnValueMatcherRepo.setReturnValue(propertyKey, returnValue, new ArgumentInvocation(argsToMatch))
            );
        };

        (mockedFunc as any).verifier = new Verifier(this.returnValueMatcherRepo, propertyKey);

        (mockedFunc as any)[_setReturnValueNoArgs] =
            (returnValue: any) => this.returnValueMatcherRepo.setReturnValue(propertyKey, returnValue, new AnyArgsMatch());

        return mockedFunc;
    }
}