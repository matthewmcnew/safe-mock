import ArgumentInvocation from "./ArgumentInvocation";

function prettyPrintOtherInteractions(expectedCalls: ArgumentInvocation[]): string {
    return expectedCalls
        .map(invocation => invocation.prettyPrint())
        .join(",");
}

export default class CallsDontMatchError extends Error {
    constructor(expectedCall: ArgumentInvocation, otherInteractions: ArgumentInvocation[], methodName: PropertyKey) {
        let message = `${methodName} was not called with: ${expectedCall.prettyPrint()}\n`;

        if (otherInteractions.length !== 0) {
            message = message + `       Other interactions with this mock: [${ prettyPrintOtherInteractions(otherInteractions)}]`;
        }
        super(message);
    }

}