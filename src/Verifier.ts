import {ReturnValueMatcherRepo} from "./ReturnValueMatcherRepo";
import ArgumentInvocation from "./ArgumentInvocation";
import CallsDontMatchError from "./CallsDontMatchError";


export class Verifier {
    public never: NeverVerifier;

    constructor(private repo: ReturnValueMatcherRepo, private propertyKey: PropertyKey) {
        this.never = new NeverVerifier(repo, propertyKey);
    }

    //noinspection JSUnusedGlobalSymbols
    called() {
        const calls = this.repo.lookupCalls(this.propertyKey);

        const [callIfExisits] = calls.filter(call => call.length == 0);

        if (callIfExisits === undefined)
            throw new Error(`${this.propertyKey} was not called`)
    }

    //noinspection JSUnusedGlobalSymbols
    calledWith(...expectedArgs: any[]) {
        const expectedArgumentInvocation = new ArgumentInvocation(expectedArgs);

        const calls = this.repo.lookupCalls(this.propertyKey);

        const [callIfExists] = calls
            .filter(expectedCall => expectedArgumentInvocation.equivalentTo(expectedCall));

        if (callIfExists == undefined) {
            throw new CallsDontMatchError(expectedArgumentInvocation, calls, this.propertyKey);
        }
    }
}

class NeverVerifier {
    private never: NeverVerifier;

    constructor(private repo: ReturnValueMatcherRepo, private propertyKey: PropertyKey) {
        this.never = this;
    }

    //noinspection JSUnusedGlobalSymbols
    called() {
        const calls = this.repo.lookupCalls(this.propertyKey);

        const zeroArgCalls = calls.filter(call => call.length == 0);

        if (zeroArgCalls.length !== 0)
            throw new Error(`${this.propertyKey} was called ${zeroArgCalls.length} times`)
    }

    //noinspection JSUnusedGlobalSymbols
    calledWith(...expectedArgs: any[]) {
        const expectedArgumentInvocation = new ArgumentInvocation(expectedArgs);

        const calls = this.repo.lookupCalls(this.propertyKey);

        const callsWithMatchingArgs = calls
            .filter(expectedCall => expectedArgumentInvocation.equivalentTo(expectedCall));

        if (callsWithMatchingArgs.length !== 0) {
            throw new Error(`${this.propertyKey} was called ${callsWithMatchingArgs.length} times with ${expectedArgumentInvocation.prettyPrint()}`);
        }
    }

}
