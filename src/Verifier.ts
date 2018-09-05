import ArgumentInvocation from "./ArgumentInvocation";
import CallsDontMatchError from "./CallsDontMatchError";
import {StubbedActionMatcherRepo} from "./StubbedActionMatcherRepo";


export class Verifier {
    public never: NeverVerifier;

    constructor(private repo: StubbedActionMatcherRepo, private propertyKey: PropertyKey) {
        this.never = new NeverVerifier(repo, propertyKey);
    }

    //noinspection JSUnusedGlobalSymbols
    called() {
        const calls = this.repo.lookupCalls(this.propertyKey);

        if (calls.length === 0)
            throw new Error(`${this.propertyKey} was never called`)
    }

    calledTimes(count: number) {
        const calls = this.repo.lookupCalls(this.propertyKey);

        if (calls.length !== count)
            throw new Error(`${this.propertyKey} was was expected to be called ${count} times, but was called ${calls.length}`)
    }


    //noinspection JSUnusedGlobalSymbols
    calledWith(...expectedArgs: any[]) {
        const expectedArgumentInvocation = new ArgumentInvocation(expectedArgs);

        const calls = this.repo.lookupCalls(this.propertyKey);

        const [callIfExists] = calls
            .filter(call => expectedArgumentInvocation.equivalentTo(call));

        if (callIfExists == undefined) {
            throw new CallsDontMatchError(expectedArgumentInvocation, calls, this.propertyKey);
        }
    }
}

class NeverVerifier {
    private never: NeverVerifier;

    constructor(private repo: StubbedActionMatcherRepo, private propertyKey: PropertyKey) {
        this.never = this;
    }

    //noinspection JSUnusedGlobalSymbols
    called() {
        const calls = this.repo.lookupCalls(this.propertyKey);

        if (calls.length !== 0)
            throw new Error(`${this.propertyKey} was called ${calls.length} times`)
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
