import ArgumentInvocation from '../src/ArgumentInvocation';
import {expect} from 'chai';

class SomeClass {
    //noinspection JSUnusedGlobalSymbols
    constructor(public someValue?: string) {
    }
}


describe('ArgumentInvocation', () => {

    describe('equivalentTo', () => {
        it('matches strings', () => {
            const stringArg = new ArgumentInvocation(["string"]);

            expect(stringArg.equivalentTo(new ArgumentInvocation(["different"]))).to.be.false;
            expect(stringArg.equivalentTo(new ArgumentInvocation(["string"]))).to.be.true;
        });

        it('matches on the same number of arguments', () => {
            const stringArg = new ArgumentInvocation(["string", "string1"]);

            expect(stringArg.equivalentTo(new ArgumentInvocation(["string"]))).to.be.false;
            expect(stringArg.equivalentTo(new ArgumentInvocation(["string", "string1"]))).to.be.true;
        });

        it('works with no args', () => {
            const noArgs = new ArgumentInvocation([]);

            expect(noArgs.equivalentTo(new ArgumentInvocation(["string"]))).to.be.false;
            expect(noArgs.equivalentTo(new ArgumentInvocation([]))).to.be.true;
        });

        it('is equivalent when objects are the same type', () => {
            const someClassArg = new ArgumentInvocation([new SomeClass("hello")]);

            expect(someClassArg.equivalentTo(new ArgumentInvocation([{someValue: "hello"}]))).to.be.false;
            expect(someClassArg.equivalentTo(new ArgumentInvocation([new SomeClass("hello")]))).to.be.true;
        });

        it('supports multiple args', () => {
            const someClassArg = new ArgumentInvocation([new SomeClass("hello"), new SomeClass("other hello")]);

            expect(someClassArg.equivalentTo(new ArgumentInvocation([new SomeClass("hello"), {someValue: "other hello"}]))).to.be.false;
            expect(someClassArg.equivalentTo(new ArgumentInvocation([new SomeClass("hello"), new SomeClass("other hello")]))).to.be.true;
        });

        it('checks property equality for type', () => {
            const argWithPropertyAsClass = new ArgumentInvocation([{prop: new SomeClass("hello")}]);

            expect(argWithPropertyAsClass.equivalentTo(new ArgumentInvocation([{prop: {someValue: "hello"}}]))).to.be.false;
            expect(argWithPropertyAsClass.equivalentTo(new ArgumentInvocation([{prop: new SomeClass("hello")}]))).to.be.true;
        });

        it('doest allow extraneous properties', () => {
            const argWithPropertyAsClass = new ArgumentInvocation([{prop: "hello"}]);

            expect(argWithPropertyAsClass.equivalentTo(new ArgumentInvocation([{
                prop: "hello",
                somethingElse: "This should break it"
            }]))).to.be.false;
        });

        it('supports undefined', () => {
            const argWithPropertyAsClass = new ArgumentInvocation([{prop: undefined}]);

            expect(argWithPropertyAsClass.equivalentTo(new ArgumentInvocation([{prop: undefined}]))).to.be.true;
        });

        it('supports null', () => {
            const argWithPropertyAsClass = new ArgumentInvocation([{prop: null}]);

            expect(argWithPropertyAsClass.equivalentTo(new ArgumentInvocation([{prop: "string"}]))).to.be.false;
            expect(argWithPropertyAsClass.equivalentTo(new ArgumentInvocation([{prop: null}]))).to.be.true;
        });

        it('supports null objects', () => {
            const argWithPropertyAsClass = new ArgumentInvocation([new SomeClass(undefined)]);

            expect(argWithPropertyAsClass.equivalentTo(new ArgumentInvocation([new SomeClass("")]))).to.be.false;
            expect(argWithPropertyAsClass.equivalentTo(new ArgumentInvocation([new SomeClass(undefined)]))).to.be.true;
        });

        it('supports functions', () => {
            let theExactSameFunction = function () {
            };
            const argWithPropertyAsClass = new ArgumentInvocation([theExactSameFunction]);

            expect(argWithPropertyAsClass.equivalentTo(new ArgumentInvocation([theExactSameFunction]))).to.be.true;
        });

        it('supports symbols', () => {
            let symbol = Symbol();
            const argWithPropertyAsClass = new ArgumentInvocation([symbol]);

            expect(argWithPropertyAsClass.equivalentTo(new ArgumentInvocation([Symbol()]))).to.be.false;
            expect(argWithPropertyAsClass.equivalentTo(new ArgumentInvocation([symbol]))).to.be.true;
        });

        it('supports empty arrays', () => {
            expect(new ArgumentInvocation([[]]).equivalentTo(new ArgumentInvocation([[]]))).to.be.true;
        });

        it('supports number', () => {
            expect(new ArgumentInvocation([7]).equivalentTo(new ArgumentInvocation([8]))).to.be.false;
            expect(new ArgumentInvocation([7]).equivalentTo(new ArgumentInvocation([7]))).to.be.true;
        });

        it('supports boolean', () => {
            expect(new ArgumentInvocation([false]).equivalentTo(new ArgumentInvocation([true]))).to.be.false;
            expect(new ArgumentInvocation([false]).equivalentTo(new ArgumentInvocation([false]))).to.be.true;
        });

        it('supports boolean', () => {
            expect(new ArgumentInvocation([false]).equivalentTo(new ArgumentInvocation([true]))).to.be.false;
            expect(new ArgumentInvocation([false]).equivalentTo(new ArgumentInvocation([false]))).to.be.true;
        });
    });
});
