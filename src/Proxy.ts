import {valueIfNoReturnValueSet} from "./valueIfNoReturnValueSet";
import ArgumentInvocation from "./ArgumentInvocation";
import _setStubbedActionNoArgs from "./_setStubbedActionNoArgsSymbol";
import {Verifier} from "./Verifier";
import StubbedActionMatcher, {StubbedAction} from "./StubbedActionMatcher";
import {StubbedActionMatcherRepo} from "./StubbedActionMatcherRepo";
import {verifier} from "../index";

export const verifyInTests: verifier = (mockToVerify: any): any => {
    return mockToVerify.verifier;
};

export class ProxyMock<T> implements ProxyHandler<T> {

    private stubbedActionMatcherRepo: StubbedActionMatcherRepo = new StubbedActionMatcherRepo();

    constructor() {
    }

    get?(target: T, propertyKey: PropertyKey, receiver: any): any {

        if (propertyKey === 'resetMock') {
            return () => {
                this.stubbedActionMatcherRepo = new StubbedActionMatcherRepo();
            };
        }

        const mockedFunc = (...argsToMatch: any[]) => {
            const lookUpResult = this.stubbedActionMatcherRepo.recordAndFindMatch(propertyKey, new ArgumentInvocation(argsToMatch));

            if (lookUpResult.returnFound)
                return lookUpResult.performMockedReturnValue();

            return valueIfNoReturnValueSet(
                lookUpResult.whyNoReturnValueMatched,

                (stubbedAction: StubbedAction) =>
                    this.stubbedActionMatcherRepo.setStubbedActionMatcher(propertyKey,
                        StubbedActionMatcher.forArgs(new ArgumentInvocation(argsToMatch), stubbedAction)
                    )
            );
        };

        (mockedFunc as any).verifier = new Verifier(this.stubbedActionMatcherRepo, propertyKey);
        (mockedFunc as any).resetMock = () => {
            this.stubbedActionMatcherRepo.resetPropertyKey(propertyKey);
        };

        (mockedFunc as any)[_setStubbedActionNoArgs] =
            (stubbedAction: StubbedAction) => this.stubbedActionMatcherRepo.setStubbedActionMatcher(propertyKey,
                StubbedActionMatcher.anyArgs(stubbedAction)
            );

        return mockedFunc;
    }
}
