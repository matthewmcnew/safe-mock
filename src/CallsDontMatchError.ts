const primitives: ReadonlyArray<String> = ["String", "Object", "Number"];

function prettyPrintOtherInteractions(expectedCalls: any[][]): string {
    return expectedCalls
        .map(prettyPrint)
        .join(",");
}

function inBraces(joiner: (a: any[]) => string) {
    return (array: any[]) => {
        return "(" + joiner(array) + ")";
    }
}

function isSpecialObject(arg: any): boolean {
    let constructorName = arg.constructor.name;
    const notFound = -1;
    return primitives.indexOf(constructorName) === notFound;
}

function printObject(arg: any): string {
    if (isSpecialObject(arg))
        return arg.constructor.name + JSON.stringify(arg);

    return JSON.stringify(arg);
}

function joinArray(expectedCall: any[]) {
    return expectedCall
        .map(arg => printObject(arg))
        .join(", ");

}

function prettyPrint(expectedCall: any[]): string {
    return inBraces(joinArray)(expectedCall);
}

export default class CallsDontMatchError extends Error {
    constructor(expectedCall: any[], otherInteractions: any[][], methodName: PropertyKey) {
        let message = `${methodName} was not called with: ${prettyPrint(expectedCall)}\n`;

        if (otherInteractions.length !== 0) {
            message = message + `       Other interactions with this mock: [${ prettyPrintOtherInteractions(otherInteractions)}]`;
        }
        super(message);
    }

}