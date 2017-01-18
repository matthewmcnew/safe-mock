export default class ReturnValueMatcher {

    constructor(private argsToMatch: any[], public returnValue: any) {
    }

    match(possibleArgsToMatch: any[]) {
        return JSON.stringify(possibleArgsToMatch) === JSON.stringify(this.argsToMatch);
    }

    printArgs(): string {
        return JSON.stringify(this.argsToMatch);
    }
}
