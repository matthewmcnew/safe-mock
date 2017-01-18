import WhyNoReturnValueMatched from './WhyNoReturnValueMatched';

export default class LookupResult {

    private constructor(public returnFound: boolean, private _whyNoReturnValueMatched?: WhyNoReturnValueMatched, public _returnValue?: any) {
    }

    static noReturnValueMatched(whyNoReturnValueMatched: WhyNoReturnValueMatched): LookupResult {
        return new LookupResult(false, whyNoReturnValueMatched);
    }

    static returnValueFound(returnValue: any): LookupResult {
        return new LookupResult(true, undefined, returnValue);
    }

    public get returnValue(): any {
        if (!this.returnFound) {
            throw new Error('No Return Found. No Return available!')
        }

        return this._returnValue;
    }

    get whyNoReturnValueMatched(): WhyNoReturnValueMatched {
        if (this.returnFound) {
            throw new Error('Return Found. No WhyNoReturnValueMatched available!')
        }

        return this._whyNoReturnValueMatched!;
    }
}