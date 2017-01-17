import {expect} from "chai";
import SafeMock from "../src/SafeMock";
import {Mock, when, verify} from "../src/SafeMock";

interface SomeService {
    createSomethingNoArgs(): string;
    createSomethingOneArg(one: string): string;
    createSomethingMultipleArgs(one: string, two: string, three: string): number;
    matchesComplexArgs(thing: Complex): string;
}

class Complex {
    //noinspection JSUnusedLocalSymbols
    constructor(private arg: {a: string, b: number}) {

    }
}

describe('SafeMock', () => {
    describe("setting return values", () => {
        it("allows setting return args for no arg mockedMethods", () => {
            const mock: Mock<SomeService> = SafeMock.build<SomeService>();

            when(mock.createSomethingNoArgs()).return("Expected Return");

            expect(mock.createSomethingNoArgs()).to.equal("Expected Return");
        });

        it("allows setting return args for 1 arg mockedMethods", () => {
            const mock: Mock<SomeService> = SafeMock.build<SomeService>();

            when(mock.createSomethingOneArg("ArgToTriggerReturn")).return("Some Return Value");

            expect(mock.createSomethingOneArg("ArgToTriggerReturn")).to.equal("Some Return Value");
        });

        it("allows setting multiple returnValues for mockedMethods", () => {
            const mock: Mock<SomeService> = SafeMock.build<SomeService>();

            when(mock.createSomethingOneArg("1")).return("one");
            when(mock.createSomethingOneArg("2")).return("two");
            when(mock.createSomethingOneArg("3")).return("three");
            when(mock.createSomethingOneArg("4")).return("four");

            expect(mock.createSomethingOneArg("4")).to.equal("four");
            expect(mock.createSomethingOneArg("3")).to.equal("three");
            expect(mock.createSomethingOneArg("2")).to.equal("two");
            expect(mock.createSomethingOneArg("1")).to.equal("one");
        });

        it("allows setting return args for 1+ arg mockedMethods", () => {
            const mock: Mock<SomeService> = SafeMock.build<SomeService>();

            when(mock.createSomethingMultipleArgs("arg1", "arg2", "arg3")).return(123);
            when(mock.createSomethingMultipleArgs("arg7", "arg8", "arg9")).return(789);

            expect(mock.createSomethingMultipleArgs("arg1", "arg2", "arg3")).to.equal(123);
            expect(mock.createSomethingMultipleArgs("arg7", "arg8", "arg9")).to.equal(789);
        });

        it("returns Object That nicely says it has not been mocked yet", () => {
            const mock: Mock<SomeService> = SafeMock.build<SomeService>();

            expect(mock.createSomethingNoArgs().toString()).to.equal("Error: MockReturn [createSomethingNoArgs] has No return value Set")
        });

        it("does not return set return value if argument's dont match", () => {
            const mock: Mock<SomeService> = SafeMock.build<SomeService>();

            when(mock.createSomethingOneArg("ArgToTriggerReturn")).return("Some Return Value");

            expect(mock.createSomethingOneArg("Not Matching ARgs")).not.to.equal("Some Return Value");
        });

        it("watches on Complex args correctly if objects match", function () {
            const mock: Mock<SomeService> = SafeMock.build<SomeService>();

            when(mock.matchesComplexArgs(new Complex({
                a: "hello",
                b: 123
            }))).return("Expected only for matching object");

            expect(mock.matchesComplexArgs(new Complex({
                a: "nope",
                b: 123
            }))).not.to.equal("Expected only for matching object");
            expect(mock.matchesComplexArgs(new Complex({
                a: "hello",
                b: -1
            }))).not.to.equal("Expected only for matching object");

            expect(mock.matchesComplexArgs(new Complex({
                a: "hello",
                b: 123
            }))).to.equal("Expected only for matching object");
        });

    });

    describe('verifying calls', () => {
        describe('no argument methods', () => {
            it("throws an exception if Not Called", () => {
                const mock: Mock<SomeService> = SafeMock.build<SomeService>();

                expect(() => {
                    verify(mock.createSomethingNoArgs).called()
                }).to.throw("createSomethingNoArgs was not called");
            });

            it("does not throw an exception if it was Called", () => {
                const mock: Mock<SomeService> = SafeMock.build<SomeService>();

                mock.createSomethingNoArgs();

                verify(mock.createSomethingNoArgs).called()
            });
        });

        describe('1 argument methods', () => {
            it("throws an exception if called with different arguments", () => {
                const mock: Mock<SomeService> = SafeMock.build<SomeService>();

                mock.createSomethingOneArg("Actual Call");

                expect(() => {
                    verify(mock.createSomethingOneArg).calledWith("ExpectedCall");
                }).to.throw("createSomethingOneArg was not called with: [ExpectedCall]");
            });

            it("throws an exception with previous interactions", () => {
                const mock: Mock<SomeService> = SafeMock.build<SomeService>();

                mock.createSomethingOneArg("First Call");
                mock.createSomethingOneArg("Second Call");

                expect(() => {
                    verify(mock.createSomethingOneArg).calledWith("ExpectedCall");
                }).to.throw("createSomethingOneArg was not called with: [ExpectedCall]\n" +
                    "       Other interactions with this mock: [First Call, Second Call]");
            });

            it("does not throw exception if calls match", () => {
                const mock: Mock<SomeService> = SafeMock.build<SomeService>();

                mock.createSomethingOneArg("ExpectedArg!");

                verify(mock.createSomethingOneArg).calledWith("ExpectedArg!");
            });
        });
    });
});
