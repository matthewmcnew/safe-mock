import ArgumentInvocation from "./ArgumentInvocation";

export default class ReturnValueMatcher {

    constructor(private argsToMatch: ArgumentInvocation, public returnValue: any) {
    }

    match(possibleArgsToMatch: ArgumentInvocation) {
        return possibleArgsToMatch.equivalentTo(this.argsToMatch);
    }

    printArgs(): string {
        return this.argsToMatch.prettyPrint();
    }
}
