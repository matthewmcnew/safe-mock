import WhyNoReturnValueMatched from './WhyNoReturnValueMatched';
import StubbedActionMatcher from "./StubbedActionMatcher";

export default class LookupResult {

    private constructor(public returnFound: boolean, private _whyNoReturnValueMatched?: WhyNoReturnValueMatched, public _returnValue?: StubbedActionMatcher) {
    }

    static noReturnValueMatched(whyNoReturnValueMatched: WhyNoReturnValueMatched): LookupResult {
        return new LookupResult(false, whyNoReturnValueMatched);
    }

    static returnValueFound(returnValue: StubbedActionMatcher): LookupResult {
        return new LookupResult(true, undefined, returnValue);
    }

    get whyNoReturnValueMatched(): WhyNoReturnValueMatched {
        if (this.returnFound) {
            throw new Error('Return Found. No WhyNoReturnValueMatched available!')
        }

        return this._whyNoReturnValueMatched!;
    }

    performMockedReturnValue() {
        if (!this.returnFound) {
            throw new Error('No Return Found. No Return available!')
        }

        return this._returnValue!.performMockedReturnValue();

    }
}
