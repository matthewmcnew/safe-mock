import {ArgumentInvocationMatcher} from "./StubbedActionMatcher";
const primitives: ReadonlyArray<String> = ["String", "Object", "Number"];

function inBraces(joiner: (a: any[]) => string) {
    return (array: any[]) => {
        return "(" + joiner(array) + ")";
    }
}

function isSpecialObject(arg: any): boolean {
    if (arg === undefined || arg === null) {
        return false;
    }
    const constructorName = arg.constructor.name;
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

export default class ArgumentInvocation implements ArgumentInvocationMatcher {
    constructor(public readonly args: any[]) {
    }

    prettyPrint(): string {
        return prettyPrint(this.args);
    }

    equivalentTo(expectedCall: ArgumentInvocation): boolean {
        if (this.args.length !== expectedCall.args.length)
            return false;

        if (this.args.length === 0)
            return true;

        for (let argIndex in this.args) {
            if (ArgumentInvocation.equalArg(this.args[argIndex], expectedCall.args[argIndex]) === false){
                return false;
            }
        }

        return true;
    }

    private static equalArg(arg1: any, arg2: any): boolean {
        if(arg1 === undefined && arg2 === undefined)
            return true;

        if(arg1 === undefined || arg2 === undefined)
            return false;

        if(arg1 === null && arg2 === null){
            return true;
        }

        if(arg1 === null || arg2 === null){
            return false;
        }

        if (arg1.constructor.name !== arg2.constructor.name)
            return false;

        const keys = [...Object.keys(arg1), ...Object.keys(arg2)];

        if(typeof arg1 === "string"|| typeof arg1 === "boolean" || typeof arg1 === "symbol" || typeof arg1 === "number")
            return arg1 == arg2;

        for (let keyIndex in keys) {
            if (ArgumentInvocation.equalArg(arg1[keys[keyIndex]], arg2[keys[keyIndex]]) === false) {
                return false;
            }
        }

        return true;
    }
}
