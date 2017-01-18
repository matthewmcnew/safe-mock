import ReturnValueMatcher from './ReturnValueMatcher';


export default class WhyNoReturnValueMatched {
    constructor(private args: any[], private setReturnValues: ReturnValueMatcher[], private propertyKey: PropertyKey) {
    }

    reasonAndAdvice(): string {
        if (this.wereReturnValuesSet()) {
            let stubbedArgs = this.argsForExisitingReturnValues().printArgs();
            return `${this.propertyKey} was stubbed to return a value when called with ${stubbedArgs} but was called with: ${JSON.stringify(this.args)}`
        }

        return `${this.propertyKey} has not been mocked yet. Set a mock return value for it.`

    }

    private argsForExisitingReturnValues() {
        return this.setReturnValues[0];
    }

    private wereReturnValuesSet(): boolean {
        return this.setReturnValues.length !== 0;
    }
}