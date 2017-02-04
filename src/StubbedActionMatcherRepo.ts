import StubbedActionMatcher from "./StubbedActionMatcher";
import ArgumentInvocation from "./ArgumentInvocation";
import LookupResult from "./LookupResult";
import WhyNoReturnValueMatched from "./WhyNoReturnValueMatched";

export class StubbedActionMatcherRepo {
    private stubbedActionMatcherMap: Record<string, StubbedActionMatcher[]> = {};
    private callMap: Record<string, ArgumentInvocation[]> = {};

    recordAndFindMatch(propertyKey: PropertyKey, argsToMatch: ArgumentInvocation): LookupResult {
        this.recordCall(propertyKey, argsToMatch);
        const stubbedActionMatchers = this.stubbedActionMatcherMap[propertyKey] || [];

        const [firstMatchedMatcher] =
            stubbedActionMatchers
                .filter((matcher: StubbedActionMatcher) => matcher.match(argsToMatch));

        if (firstMatchedMatcher) {
            return LookupResult.returnValueFound(firstMatchedMatcher);
        } else {
            return LookupResult.noReturnValueMatched(
                new WhyNoReturnValueMatched(argsToMatch, stubbedActionMatchers, propertyKey)
            );
        }
    }

    setStubbedActionMatcher(propertyKey: PropertyKey, stubbedActionMatcher: StubbedActionMatcher) {
        if (!this.stubbedActionMatcherMap[propertyKey])
            this.stubbedActionMatcherMap[propertyKey] = [];

        this.stubbedActionMatcherMap[propertyKey].push(stubbedActionMatcher);
    }

    lookupCalls(propertyKey: PropertyKey): ArgumentInvocation[] {
        return this.callMap[propertyKey] || [];
    }

    private recordCall(propertyKey: PropertyKey, argsToMatch: ArgumentInvocation) {
        this.callMap[propertyKey] = (this.callMap[propertyKey] || []);

        this.callMap[propertyKey].push(argsToMatch)
    }
}
