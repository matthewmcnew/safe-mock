const primitives: ReadonlyArray<String> = ["String", "Object", "Number"];

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

export default class ArgumentInvocation {

    constructor(private args: any[]) {
    }


    public get length(): number {
        return this.args.length;
    }

    prettyPrint(): string {
        return prettyPrint(this.args);
    }

    equivalentTo(expectedCall: ArgumentInvocation): boolean {
        return JSON.stringify(this.args) === JSON.stringify(expectedCall.args);
    }
}