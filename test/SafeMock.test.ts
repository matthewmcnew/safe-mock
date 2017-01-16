import {expect} from "chai";
import SafeMock from "../src/SafeMock";
import {Mock, when} from "../src/SafeMock";

interface SomeService {
    createSomethingNoArgs(): string;
    createSomethingOneArg(one: string): string;
    createSomethingMultipleArgs(one: string, two: string, three: string): number;
}


describe('Result', () => {
    describe("setting return values", () => {
        it("allows setting return args for no arg mockedMethods", function () {
            const mock: Mock<SomeService> = SafeMock.build<SomeService>();

            when(mock.createSomethingNoArgs()).return("Expected Return");

            expect(mock.createSomethingNoArgs()).to.equal("Expected Return");
        });

        it("allows setting return args for 1 arg mockedMethods", function () {
            const mock: Mock<SomeService> = SafeMock.build<SomeService>();

            when(mock.createSomethingOneArg("ArgToTriggerReturn")).return("Some Return Value");

            expect(mock.createSomethingOneArg("ArgToTriggerReturn")).to.equal("Some Return Value");
        });

        it("allows setting multiple returnValues for mockedMethods", function () {
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

        it("allows setting return args for 1+ arg mockedMethods", function () {
            const mock: Mock<SomeService> = SafeMock.build<SomeService>();

            when(mock.createSomethingMultipleArgs("arg1", "arg2", "arg3")).return(123);
            when(mock.createSomethingMultipleArgs("arg7", "arg8", "arg9")).return(789);

            expect(mock.createSomethingMultipleArgs("arg1", "arg2", "arg3")).to.equal(123);
            expect(mock.createSomethingMultipleArgs("arg7", "arg8", "arg9")).to.equal(789);
        });

        it("returns Object That nicely says it has not been mocked yet", function () {
            const mock: Mock<SomeService> = SafeMock.build<SomeService>();

            expect(mock.createSomethingNoArgs().toString()).to.equal("Error: MockReturn [createSomethingNoArgs] has No return value Set")
        });

        it("does not return set return value if argument's dont match", function () {
            const mock: Mock<SomeService> = SafeMock.build<SomeService>();

            when(mock.createSomethingOneArg("ArgToTriggerReturn")).return("Some Return Value");

            expect(mock.createSomethingOneArg("Not Matching ARgs")).not.to.equal("Some Return Value");
        });
    });
});
