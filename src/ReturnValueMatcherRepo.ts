
import ReturnValueMatcher from "./ReturnValueMatcher";
import ArgumentInvocation from "./ArgumentInvocation";
import LookupResult from "./LookupResult";
import WhyNoReturnValueMatched from "./WhyNoReturnValueMatched";
import {ArgumentInvocationMatcher} from "./ReturnValueMatcher";

export class ReturnValueMatcherRepo {
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
