import {verifier} from "./SafeMock";
import {valueIfNoReturnValueSet} from "./valueIfNoReturnValueSet";
import ArgumentInvocation from "./ArgumentInvocation";
import AnyArgsMatch from "./AnyArgsMatch";
import _setReturnValueNoArgs from "./_setReturnValueNoArgsSymbol";
import {Verifier} from "./Verifier";
import {ReturnValueMatcherRepo} from "./ReturnValueMatcherRepo";

export const verifyInTests: verifier = (mockToVerify: any): any => {
    return mockToVerify.verifier;
};

export class ProxyMock<T> implements ProxyHandler<T> {

    private returnValueMatcherRepo: ReturnValueMatcherRepo = new ReturnValueMatcherRepo();

    constructor() {
    }

    get?(target: T, propertyKey: PropertyKey, receiver: any): any {

        const mockedFunc = (...argsToMatch: any[]) => {
            const lookUpResult = this.returnValueMatcherRepo.recordAndFindMatch(propertyKey, new ArgumentInvocation(argsToMatch));

            if (lookUpResult.returnFound)
                return lookUpResult.returnValue;

            return valueIfNoReturnValueSet(
                lookUpResult.whyNoReturnValueMatched,
                (returnValue: any) => this.returnValueMatcherRepo.setReturnValue(propertyKey, returnValue, new ArgumentInvocation(argsToMatch))
            );
        };

        (mockedFunc as any).verifier = new Verifier(this.returnValueMatcherRepo, propertyKey);

        (mockedFunc as any)[_setReturnValueNoArgs] =
            (returnValue: any) => this.returnValueMatcherRepo.setReturnValue(propertyKey, returnValue, new AnyArgsMatch());

        return mockedFunc;
    }
}
