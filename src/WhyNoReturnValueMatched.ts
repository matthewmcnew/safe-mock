import ReturnValueMatcher from './ReturnValueMatcher';
import ArgumentInvocation from "./ArgumentInvocation";


export default class WhyNoReturnValueMatched {
    constructor(private args: ArgumentInvocation, private returnValueMatchers: ReturnValueMatcher[], private propertyKey: PropertyKey) {
    }

    reasonAndAdvice(): string {
        if (this.wereReturnValuesSet()) {
            let stubbedArgs = this.argsForExisitingReturnValues();
            return `${this.propertyKey} was stubbed to return a value when called with ${stubbedArgs} but was called with: ${this.args.prettyPrint()}`
        }

        return `${this.propertyKey} has not been mocked yet. Set a mock return value for it.`

    }

    private argsForExisitingReturnValues() {
        return this.returnValueMatchers
            .map((arg)=> arg.printArgs())
            .join(' or ');
    }

    private wereReturnValuesSet(): boolean {
        return this.returnValueMatchers.length !== 0;
    }
}
