import {valueIfNoReturnValueSet} from "./valueIfNoReturnValueSet";
import ArgumentInvocation from "./ArgumentInvocation";
import _setStubbedActionNoArgs from "./_setStubbedActionNoArgsSymbol";
import {Verifier} from "./Verifier";
import {StubbedAction} from "./StubbedActionMatcher";
import {StubbedActionMatcherRepo} from "./StubbedActionMatcherRepo";
import {verifier} from "../index";
import setStubbedActionNoArgsMatcher from "./_setStubbedActionNoArgsSymbol";

export const verifyInTests: verifier = (mockToVerify: any): any => {
    return mockToVerify.verifier;
};

const callableMock = Symbol('CallableMock');

export class ProxyMock<T extends object> implements ProxyHandler<T> {

    private stubbedActionMatcherRepo: StubbedActionMatcherRepo = new StubbedActionMatcherRepo();

    constructor() {
    }

    get(target: T, propertyKey: PropertyKey, receiver: any): any {
        if (propertyKey === 'resetMock') {
            return () => {
                this.stubbedActionMatcherRepo = new StubbedActionMatcherRepo();
            };
        } else if (propertyKey === setStubbedActionNoArgsMatcher) {
            return (stubbedAction: StubbedAction) =>
                this.stubbedActionMatcherRepo.setStubbedActionForAnyArgs(
                    callableMock,
                    stubbedAction
                );
        }

        return this.buildMockedMethod(propertyKey);
    }

    apply(target: T, thisArg: any, argArray?: any): any {
        return this.buildMockedMethod(callableMock)(...argArray);
    }

    private buildMockedMethod(propertyKey: PropertyKey) {
        const mockedFunc = (...argsToMatch: any[]) => {
            const lookUpResult = this.stubbedActionMatcherRepo
                .recordAndFindMatch(propertyKey, new ArgumentInvocation(argsToMatch));

            if (lookUpResult.returnFound)
                return lookUpResult.performMockedReturnValue();

            return valueIfNoReturnValueSet(
                lookUpResult.whyNoReturnValueMatched,

                (stubbedAction: StubbedAction) =>
                    this.stubbedActionMatcherRepo.setStubbedActionForArgs(
                        propertyKey,
                        new ArgumentInvocation(argsToMatch),
                        stubbedAction
                    )
            );
        };

        (mockedFunc as any).verifier = new Verifier(this.stubbedActionMatcherRepo, propertyKey);
        (mockedFunc as any).resetMock = () => {
            this.stubbedActionMatcherRepo.resetPropertyKey(propertyKey);
        };

        (mockedFunc as any)[_setStubbedActionNoArgs] =
            (stubbedAction: StubbedAction) =>
                this.stubbedActionMatcherRepo.setStubbedActionForAnyArgs(
                    propertyKey,
                    stubbedAction
                );

        return mockedFunc;
    }
}
