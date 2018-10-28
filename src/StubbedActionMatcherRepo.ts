import StubbedActionMatcher from "./StubbedActionMatcher";
import ArgumentInvocation from "./ArgumentInvocation";
import LookupResult from "./LookupResult";
import WhyNoReturnValueMatched from "./WhyNoReturnValueMatched";
import {StubbedAction} from "./StubbedActionMatcher";

export class StubbedActionMatcherRepo {
    private stubbedActionMatcherMap: Record<string, StubbedActionMatcher[]> = {};
    private callMap: Record<string, ArgumentInvocation[]> = {};

    recordAndFindMatch(propertyKey: PropertyKey, argsToMatch: ArgumentInvocation): LookupResult {
        this.recordCall(propertyKey, argsToMatch);
        const stubbedActionMatchers = this.stubbedActionMatcherMap[String(propertyKey)] || [];

        const [lastMatchedMatcher] =
            stubbedActionMatchers
                .filter((matcher: StubbedActionMatcher) => matcher.match(argsToMatch))
                .reverse();

        if (lastMatchedMatcher) {
            return LookupResult.returnValueFound(lastMatchedMatcher);
        } else {
            return LookupResult.noReturnValueMatched(
                new WhyNoReturnValueMatched(argsToMatch, stubbedActionMatchers, propertyKey)
            );
        }
    }

    setStubbedActionForArgs(propertyKey: PropertyKey, argumentInvocation: ArgumentInvocation, stubbedAction: StubbedAction) {
        this.deleteCallRecord(propertyKey, argumentInvocation);
        this.setStubbedActionMatcher(propertyKey, StubbedActionMatcher.forArgs(argumentInvocation, stubbedAction));
    }

    setStubbedActionForAnyArgs(propertyKey: PropertyKey, stubbedAction: StubbedAction) {
        this.setStubbedActionMatcher(propertyKey, StubbedActionMatcher.anyArgs(stubbedAction));
    }

    private setStubbedActionMatcher(propertyKey: PropertyKey, stubbedActionMatcher: StubbedActionMatcher) {
        if (!this.stubbedActionMatcherMap[String(propertyKey)])
            this.stubbedActionMatcherMap[String(propertyKey)] = [];

        this.stubbedActionMatcherMap[String(propertyKey)].push(stubbedActionMatcher);
    }

    lookupCalls(propertyKey: PropertyKey): ArgumentInvocation[] {
        return this.callMap[String(propertyKey)] || [];
    }

    private recordCall(propertyKey: PropertyKey, argsToMatch: ArgumentInvocation) {
        this.callMap[String(propertyKey)] = (this.callMap[String(propertyKey)] || []);

        this.callMap[String(propertyKey)].push(argsToMatch)
    }

    resetPropertyKey(propertyKey: PropertyKey) {
        this.stubbedActionMatcherMap[String(propertyKey)] = [];
        this.callMap[String(propertyKey)] = [];
    }

    private deleteCallRecord(propertyKey: PropertyKey, argumentInvocation: ArgumentInvocation) {
        this.callMap[String(propertyKey)] = (this.callMap[String(propertyKey)] || []);

        this.callMap[String(propertyKey)] = this.callMap[String(propertyKey)].filter((call) => !call.equivalentTo(argumentInvocation))

    }
}
