import ArgumentInvocation from "./ArgumentInvocation";

export interface ArgumentInvocationMatcher {
    equivalentTo(argumentInvocation: ArgumentInvocation): boolean
    prettyPrint(): string
}

export default class ReturnValueMatcher {

    constructor(private argumentInvocationMatcher: ArgumentInvocationMatcher, public returnValue: any) {
    }

    match(possibleArgsToMatch: ArgumentInvocation) {
        return this.argumentInvocationMatcher.equivalentTo(possibleArgsToMatch);
    }

    printArgs(): string {
        return this.argumentInvocationMatcher.prettyPrint();
    }
}
