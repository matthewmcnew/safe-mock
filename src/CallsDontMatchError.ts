import ArgumentInvocation from "./ArgumentInvocation";

function prettyPrintOtherInteractions(expectedCalls: ArgumentInvocation[]): string {
    return expectedCalls
        .map(invocation => invocation.prettyPrint())
        .join(",");
}

export default class CallsDontMatchError extends Error {
    public showDiff: boolean;
    public expected: {};
    public actual: {};


    constructor(expectedCall: ArgumentInvocation, otherInteractions: ArgumentInvocation[], methodName: PropertyKey) {
        super();
        let message = `${methodName} was not called with: ${expectedCall.prettyPrint()}\n`;

        if (otherInteractions.length !== 0) {
            message = message + `       Other interactions with this mock: [${ prettyPrintOtherInteractions(otherInteractions)}]`;
        }
        super(message);

        this.showDiff = true;
        this.expected = expectedCall.args;
        this.actual = otherInteractions.map((interactions) => interactions.args);
    }

}
