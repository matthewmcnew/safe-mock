import ArgumentInvocation from "./ArgumentInvocation";
import AnyArgsMatch from "./AnyArgsMatch";

export interface ArgumentInvocationMatcher {
    equivalentTo(argumentInvocation: ArgumentInvocation): boolean
    prettyPrint(): string
}

export class ReturnValueAction implements StubbedAction {

    constructor(private valueToReturn: any) {
    }

    performMockedReturnValue(): any {
        return this.valueToReturn;
    }


    static of(valueToReturn: any) {
        return new ReturnValueAction(valueToReturn);
    }
}

export class ThrowingAction implements StubbedAction {

    constructor(private valueToThrow: any) {
    }

    performMockedReturnValue(): any {
        throw this.valueToThrow;
    }


    static of(valueToThrow: any) {
        return new ThrowingAction(valueToThrow);
    }
}

export class RejectedPromiseAction implements StubbedAction {

    constructor(private valueToReject: any) {
    }

    performMockedReturnValue(): any {
        return Promise.reject(this.valueToReject);
    }


    static of(valueToReject: any) {
        return new RejectedPromiseAction(valueToReject);
    }
}

export class ResolvedPromiseAction implements StubbedAction {

    constructor(private valueToResolve: any) {
    }

    performMockedReturnValue(): any {
        return Promise.resolve(this.valueToResolve);
    }


    static of(valueToResolve: any) {
        return new ResolvedPromiseAction(valueToResolve);
    }
}


export interface StubbedAction {
    performMockedReturnValue(): any
}

export default class StubbedActionMatcher {

    private constructor(private argumentInvocationMatcher: ArgumentInvocationMatcher, private stubbedAction: StubbedAction) {
    }

    match(possibleArgsToMatch: ArgumentInvocation) {
        return this.argumentInvocationMatcher.equivalentTo(possibleArgsToMatch);
    }

    printArgs(): string {
        return this.argumentInvocationMatcher.prettyPrint();
    }

    performMockedReturnValue() {
        return this.stubbedAction.performMockedReturnValue();

    }

    static anyArgs(stubbedAction: StubbedAction) {
        return new StubbedActionMatcher(new AnyArgsMatch(), stubbedAction);
    }

    static forArgs(argumentInvocation: ArgumentInvocation, stubbedAction: StubbedAction) {
        return new StubbedActionMatcher(argumentInvocation, stubbedAction);
    }
}
