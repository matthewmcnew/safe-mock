import {expect} from "chai";
import SafeMock, {when, verify} from "../src/SafeMock";
import {Mock, MockFunction} from "../index";

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
    describe("return values from mocks", () => {

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

            it("does not return set return value if argument's dont match", () => {
                const mock: Mock<SomeService> = SafeMock.build<SomeService>();

                when(mock.createSomethingOneArg("ArgToTriggerReturn")).return("Some Return Value");

                expect(mock.createSomethingOneArg("Not Matching ARgs")).not.to.equal("Some Return Value");
            });

            it("matches on Complex args correctly if objects match", () => {
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

            it("supports setting return values without arguments", () => {
                const mock: Mock<SomeService> = SafeMock.build<SomeService>();

                when(mock.createSomethingOneArg).return("Stubbed Return Value");

                expect(mock.createSomethingOneArg("this should not matter")).to.eq("Stubbed Return Value")
            });

            it("allows setting return args for mocked Methods", () => {
                type FunctionToMock = () => string;

                const mockedFunction: MockFunction<FunctionToMock> = SafeMock.mockFunction<FunctionToMock>("name");

                when(mockedFunction()).return("Expected Return");

                expect(mockedFunction()).to.equal("Expected Return");
            });

            it("allows setting return args for callable interfaces", () => {
                interface CallableInterface {
                    (): string;
                }

                const mock = SafeMock.build<CallableInterface>();

                expect(() => mock().length).to.throw('has not been mocked yet');

                when(mock).return("Expected Return");

                expect(mock()).to.equal("Expected Return");
            });

            it("allows setting return args for callable interfaces with arguments", () => {
                interface CallableInterface {
                    (a: string): string;
                }

                const mock = SafeMock.build<CallableInterface>();

                expect(() => mock("hello").length).to.throw('has not been mocked yet');

                when(mock("hello")).return("Expected Return");

                expect(mock("hello")).to.equal("Expected Return");
            });

            it("allows functions to be mocked by passing them into the mockFunction method", () => {
                function functionToMock(someStringArg: string) {
                    return 123;
                }

                const mockedFunction = SafeMock.mockFunction(functionToMock);

                when(mockedFunction("blah")).return(10);

                expect(mockedFunction("blah")).to.equal(10);
            });

            it("allows setting return args for mocked Methods with multiple args", () => {
                type FunctionToMock = (arg: string, arg2: string) => string;

                const mockedFunction: MockFunction<FunctionToMock> = SafeMock.mockFunction<FunctionToMock>("name");

                when(mockedFunction("one", "two")).return("Expected Return");

                expect(mockedFunction("one", "two")).to.equal("Expected Return");
            });

            it("does not return value if args do not match", () => {
                type FunctionToMock = (arg: string, arg2: string) => string;

                const mockedFunction: MockFunction<FunctionToMock> = SafeMock.mockFunction<FunctionToMock>("name");

                when(mockedFunction("one", "two")).return("UnExpected Return");

                expect(mockedFunction("something", "else")).not.to.equal("UnExpected Return");
            });

            it("throws friendly exception if when is called with a non mocked thing", () => {
                expect(() => {
                    when("this is no good").return("holla")
                }).to.throw("Whoops! Looks like you called `when` incorrectly. Make sure you create a Mock First!");
            });

            it("allows generic return values to be overridden", () => {
                const mock: Mock<SomeService> = SafeMock.build<SomeService>();

                when(mock.createSomethingOneArg).return("original coke");
                when(mock.createSomethingOneArg).return("new coke");

                expect(mock.createSomethingOneArg("not used")).to.equal("new coke");
            });
        });

        describe("making mocks throw", () => {
            it("allows making mocks throw exceptions", () => {
                const mock: Mock<SomeService> = SafeMock.build<SomeService>();

                when(mock.createSomethingNoArgs()).throw(new Error("Ah Geez!"));

                expect(() => {
                    mock.createSomethingNoArgs();
                }).to.throw("Ah Geez!");
            });

            it("does not throw exceptions if args dont match", () => {
                const mock: Mock<SomeService> = SafeMock.build<SomeService>();

                when(mock.createSomethingOneArg("cause problem1")).throw(new Error("Ah Geez 1!"));
                when(mock.createSomethingOneArg("cause problem2")).throw(new Error("Ah Geez 2!"));

                mock.createSomethingOneArg("unrelated");

                expect(() => {
                    mock.createSomethingOneArg("cause problem1");
                }).to.throw("Ah Geez 1!");

                expect(() => {
                    mock.createSomethingOneArg("cause problem2");
                }).to.throw("Ah Geez 2!");
            });

            it("allows setting thrown exceptions without specifying arguments", () => {
                const mock: Mock<SomeService> = SafeMock.build<SomeService>();

                when(mock.createSomethingOneArg).throw(new Error("Ah Geez!"));

                expect(() => {
                    mock.createSomethingOneArg("cause problem1");
                }).to.throw("Ah Geez!");

                expect(() => {
                    mock.createSomethingOneArg("cause problem2");
                }).to.throw("Ah Geez!");
            });


        });

        describe("setting promise return values", () => {
            it("allows setting promise rejections directly", () => {
                interface PromiseSomeService {
                    someMethodThatReturnsAPromise(): Promise<void>;
                }

                const mock: Mock<PromiseSomeService> = SafeMock.build<PromiseSomeService>();

                when(mock.someMethodThatReturnsAPromise()).reject(new Error("Ah Geez!"));

                return mock.someMethodThatReturnsAPromise()
                    .then(
                        () => expect.fail('Promise Should not resolve'),
                        (err) => expect(err).to.eql(new Error("Ah Geez!")),
                    )
            });

            it("allows setting promise resolved directly", () => {
                interface PromiseSomeService {
                    someMethodThatReturnsAPromise(): Promise<string>;
                }

                const mock: Mock<PromiseSomeService> = SafeMock.build<PromiseSomeService>();

                when(mock.someMethodThatReturnsAPromise()).resolve("Value to resolve");

                return mock.someMethodThatReturnsAPromise()
                    .then(
                        (resolvedValue) => {
                            expect(resolvedValue).to.eql("Value to resolve")
                        }
                    )
            });

            it("allows setting promise resolved with a void directly", () => {
                interface PromiseSomeService {
                    someMethodThatReturnsAPromise(): Promise<void>;
                }

                const mock: Mock<PromiseSomeService> = SafeMock.build<PromiseSomeService>();

                when(mock.someMethodThatReturnsAPromise()).resolveVoid();

                return mock.someMethodThatReturnsAPromise()
                    .then(
                        (resolvedValue) => {
                            expect(resolvedValue).to.be.undefined
                        }
                    )
            });
        });

        describe("No Return Value Set", () => {

            it("returns object from mock that throws exception if anyone tries to get a field or a method on it", () => {
                interface SomeObjectThatMockReturns {
                    thisSHouldBlowUpFromMock(): void
                    field: string
                }

                interface ObjectToMock {
                    returnTheObject(): SomeObjectThatMockReturns
                }

                const mock: Mock<ObjectToMock> = SafeMock.build<ObjectToMock>();

                expect(() => {
                    mock.returnTheObject().thisSHouldBlowUpFromMock();
                }).to.throw(`returnTheObject has not been mocked yet. Set a mock return value for it.`);

                expect(() => {
                    //noinspection JSUnusedLocalSymbols
                    const dontMindMedontMindMe = mock.returnTheObject().field;
                }).to.throw(`returnTheObject has not been mocked yet. Set a mock return value for it.`);
            });

            it("returns object from mock that throws exception with stubbed argument methods for helpful debugging", () => {
                interface SomeObjectThatMockReturns {
                    field: string
                }

                interface ObjectToMock {
                    returnTheObject(someArg: {a: string}): SomeObjectThatMockReturns
                }

                const mock: Mock<ObjectToMock> = SafeMock.build<ObjectToMock>();

                when(mock.returnTheObject({a: 'when'})).return({field: "hello"});

                expect(() => {
                    //noinspection JSUnusedLocalSymbols
                    const dontMindMe = mock.returnTheObject({a: 'not Matching'}).field;
                }).to.throw(`returnTheObject was stubbed to return a value when called with ({"a":"when"}) but was called with: ({"a":"not Matching"})`);
            });


            it("returns object from mock that throws exception with multiple stubbed argument methods for helpful debugging", () => {
                interface SomeObjectThatMockReturns {
                    field: string
                }

                interface ObjectToMock {
                    returnTheObject(someArg: {a: string}): SomeObjectThatMockReturns
                }

                const mock: Mock<ObjectToMock> = SafeMock.build<ObjectToMock>();

                when(mock.returnTheObject({a: 'when'})).return({field: "hello"});
                when(mock.returnTheObject({a: 'other option'})).return({field: "hello"});

                expect(() => {
                    //noinspection JSUnusedLocalSymbols
                    const dontMindMe = mock.returnTheObject({a: 'not Matching'}).field;
                }).to.throw(`({"a":"when"})`);

                expect(() => {
                    //noinspection JSUnusedLocalSymbols
                    const dontMindMe = mock.returnTheObject({a: 'not Matching'}).field;
                }).to.throw(`({"a":"other option"})`)
            });

            it("returns object from mock that throws exception if anyone tries to set a field on it", () => {
                interface SomeObjectThatMockReturns {
                    field: string
                }

                interface ObjectToMock {
                    returnTheObject(): SomeObjectThatMockReturns
                }

                const mock: Mock<ObjectToMock> = SafeMock.build<ObjectToMock>();

                expect(() => {
                    mock.returnTheObject().field = "Oh Hello";
                }).to.throw(`returnTheObject has not been mocked yet. Set a mock return value for it.`);
            });

            it("returns object from mock that throws exception if anyone tries to call it", () => {
                interface ObjectToMock {
                    returnTheObject(): () => void
                }

                const mock: Mock<ObjectToMock> = SafeMock.build<ObjectToMock>();

                expect(() => {
                    mock.returnTheObject()();
                }).to.throw(`returnTheObject has not been mocked yet. Set a mock return value for it.`);
            });
        });
    });

    describe('verifying calls', () => {
        describe('no argument methods', () => {
            it("throws an exception if Not Called", () => {
                const mock: Mock<SomeService> = SafeMock.build<SomeService>();

                expect(() => {
                    verify(mock.createSomethingNoArgs).called()
                }).to.throw("createSomethingNoArgs was never called");
            });

            it("does not throw an exception if it was Called", () => {
                const mock: Mock<SomeService> = SafeMock.build<SomeService>();

                mock.createSomethingNoArgs();

                verify(mock.createSomethingNoArgs).called()
            });
        });

        describe('on mocked Functions', () => {
            type FunctionToMock = () => string;

            it("throws an exception if Not Called", () => {
                const mockedFunction: MockFunction<FunctionToMock> = SafeMock.mockFunction<FunctionToMock>("nameOfFunc");

                expect(() => {
                    verify(mockedFunction).called()
                }).to.throw("nameOfFunc was never called");
            });

            it("uses function name if available in exception", () => {
                function namedFunc() {
                }

                const mockedFunction = SafeMock.mockFunction(namedFunc);

                expect(() => {
                    verify(mockedFunction).called()
                }).to.throw("namedFunc was never called");
            });

            it("does not throw an exception if it was Called", () => {
                const mockedFunction: MockFunction<FunctionToMock> = SafeMock.mockFunction<FunctionToMock>("nameOfFunc");

                mockedFunction();

                verify(mockedFunction).called()
            });
        });

        describe('Multiple argument methods', () => {

            describe('1 argument methods', () => {
                it("throws an exception if called with different arguments", () => {
                    const mock: Mock<SomeService> = SafeMock.build<SomeService>();

                    mock.createSomethingOneArg("Actual Call");

                    expect(() => {
                        verify(mock.createSomethingOneArg).calledWith("ExpectedCall");
                    }).to.throw(`createSomethingOneArg was not called with: ("ExpectedCall")`);
                });

                it("does not count invocations from setting return values", () => {
                    const mock: Mock<SomeService> = SafeMock.build<SomeService>();

                    when(mock.createSomethingOneArg("NotARealCall")).return("hi");

                    expect(() => {
                        verify(mock.createSomethingOneArg).calledWith("NotARealCall");
                    }).to.throw(`createSomethingOneArg was not called with: ("NotARealCall")`);
                });

                it("allows checking that method was called", () => {
                    const mock: Mock<SomeService> = SafeMock.build<SomeService>();

                    expect(() => {
                        verify(mock.createSomethingOneArg).called();
                    }).to.throw;

                    mock.createSomethingOneArg("Actual Call");

                    verify(mock.createSomethingOneArg).called();
                });

                it("throws an exception with previous interactions", () => {
                    const mock: Mock<SomeService> = SafeMock.build<SomeService>();

                    mock.createSomethingOneArg("First Call");
                    mock.createSomethingOneArg("Second Call");

                    expect(() => {
                        verify(mock.createSomethingOneArg).calledWith("ExpectedCall");
                    }).to.throw(`createSomethingOneArg was not called with: ("ExpectedCall")\n` +
                        `       Other interactions with this mock: [("First Call"),("Second Call")]`);
                });

                it("does not throw exception if calls match", () => {
                    const mock: Mock<SomeService> = SafeMock.build<SomeService>();

                    mock.createSomethingOneArg("ExpectedArg!");

                    verify(mock.createSomethingOneArg).calledWith("ExpectedArg!");
                });

                it("matches verify on object arguments", () => {
                    interface ObjectArgMock {
                        methodWithObjectArg(object: {a: string, b: number}): void
                    }

                    const mock: Mock<ObjectArgMock> = SafeMock.build<ObjectArgMock>();

                    expect(() => {
                        verify(mock.methodWithObjectArg).calledWith({a: "expectedString", b: 99});
                    }).to.throw(`methodWithObjectArg was not called with: ({"a":"expectedString","b":99})`);

                    mock.methodWithObjectArg({a: "notExpectedString", b: 99});

                    expect(() => {
                        verify(mock.methodWithObjectArg).calledWith({a: "expectedString", b: 99});
                    }).to.throw();

                    mock.methodWithObjectArg({a: "expectedString", b: 99});

                    verify(mock.methodWithObjectArg).calledWith({a: "expectedString", b: 99});
                });


                it("throws exception if called arguments' prototypes dont match", () => {
                    class SomeClass {
                        //noinspection JSUnusedGlobalSymbols
                        constructor(public someValue: string) {
                        }
                    }

                    interface ObjectArgMock {
                        methodWithClassArg(object: SomeClass): void
                    }

                    const mock: Mock<ObjectArgMock> = SafeMock.build<ObjectArgMock>();

                    mock.methodWithClassArg({someValue: "some value"});

                    expect(() => {
                        verify(mock.methodWithClassArg).calledWith(new SomeClass("some value"));
                    }).to.throw(`methodWithClassArg was not called with: (SomeClass{"someValue":"some value"}`);
                });
            });

            describe("Two Argument methods", () => {
                interface TwoArgs {
                    method(arg: number, arg2: string): void
                }

                it("throws an exception if called with different arguments", () => {
                    const mock: Mock<TwoArgs> = SafeMock.build<TwoArgs>();

                    mock.method(1, "arg2");

                    expect(() => {
                        verify(mock.method).calledWith(1, "expected");
                    }).to.throw(`method was not called with: (1, "expected")`);
                });

                it("does not throw exception if arguments match", () => {
                    interface TwoArgs {
                        method(arg: number, arg2: string): void
                    }

                    const mock: Mock<TwoArgs> = SafeMock.build<TwoArgs>();

                    mock.method(-9, "expected");

                    verify(mock.method).calledWith(-9, "expected");
                });
            });

            describe("Three+ Argument methods", () => {
                interface ThreePlus {
                    three(arg: string, arg2: string, arg3: string): void
                    four(arg: string, arg2: string, arg3: string, arg4: string): void
                    five(arg: string, arg2: string, arg3: string, arg4: string, arg5: string): void
                    six(arg: string, arg2: string, arg3: string, arg4: string, arg5: string, arg6: string): void
                    seven(arg: string, arg2: string, arg3: string, arg4: string, arg5: string, arg6: string, arg7: string): void
                    eight(arg: string, arg2: string, arg3: string, arg4: string, arg5: string, arg6: string, arg7: string, arg8: string): void
                    nine(arg: string, arg2: string, arg3: string, arg4: string, arg5: string, arg6: string, arg7: string, arg8: string, arg9: string): void
                    ten(arg: string, arg2: string, arg3: string, arg4: string, arg5: string, arg6: string, arg7: string, arg8: string, arg9: string, arg10: string): void
                }

                it("throws an exception if called with different arguments", () => {
                    const mock: Mock<ThreePlus> = SafeMock.build<ThreePlus>();

                    mock.three("1", "2", "3");
                    mock.four("1", "2", "3", "4");
                    mock.five("1", "2", "3", "4", "5");
                    mock.six("1", "2", "3", "4", "5", "6");
                    mock.seven("1", "2", "3", "4", "5", "6", "7");
                    mock.eight("1", "2", "3", "4", "5", "6", "7", "8");
                    mock.nine("1", "2", "3", "4", "5", "6", "7", "8", "9");
                    mock.ten("1", "2", "3", "4", "5", "6", "7", "8", "9", "10");

                    expect(() => {
                        verify(mock.three).calledWith("1", "2", "Different");
                    }).to.throw("three was not called");


                    expect(() => {
                        verify(mock.four).calledWith("1", "2", "3", "Different");
                    }).to.throw("four was not called");


                    expect(() => {
                        verify(mock.five).calledWith("1", "2", "3", "4", "Different");
                    }).to.throw("five was not called");


                    expect(() => {
                        verify(mock.six).calledWith("1", "2", "3", "4", "5", "Different");
                    }).to.throw("six was not called");


                    expect(() => {
                        verify(mock.seven).calledWith("1", "2", "3", "4", "5", "6", "Different");
                    }).to.throw("seven was not called");


                    expect(() => {
                        verify(mock.eight).calledWith("1", "2", "3", "4", "5", "6", "7", "Different");
                    }).to.throw("eight was not called");


                    expect(() => {
                        verify(mock.nine).calledWith("1", "2", "3", "4", "5", "6", "7", "8", "Different");
                    }).to.throw("nine was not called");


                    expect(() => {
                        verify(mock.ten).calledWith("1", "2", "3", "4", "5", "6", "7", "8", "9", "Different");
                    }).to.throw("ten was not called");
                });

                it("does not throw an exception if called with matching args", () => {
                    const mock: Mock<ThreePlus> = SafeMock.build<ThreePlus>();

                    mock.three("1", "2", "3");
                    mock.four("1", "2", "3", "4");
                    mock.five("1", "2", "3", "4", "5");
                    mock.six("1", "2", "3", "4", "5", "6");
                    mock.seven("1", "2", "3", "4", "5", "6", "7");
                    mock.eight("1", "2", "3", "4", "5", "6", "7", "8");
                    mock.nine("1", "2", "3", "4", "5", "6", "7", "8", "9");
                    mock.ten("1", "2", "3", "4", "5", "6", "7", "8", "9", "10");

                    verify(mock.three).calledWith("1", "2", "3");
                    verify(mock.four).calledWith("1", "2", "3", "4");
                    verify(mock.five).calledWith("1", "2", "3", "4", "5");
                    verify(mock.six).calledWith("1", "2", "3", "4", "5", "6");
                    verify(mock.seven).calledWith("1", "2", "3", "4", "5", "6", "7");
                    verify(mock.eight).calledWith("1", "2", "3", "4", "5", "6", "7", "8");
                    verify(mock.nine).calledWith("1", "2", "3", "4", "5", "6", "7", "8", "9");
                    verify(mock.ten).calledWith("1", "2", "3", "4", "5", "6", "7", "8", "9", "10");
                });
            });

        });

        describe('verifying no interactions', () => {
            it('never.called() exception if interaction occurred', () => {
                const mock: Mock<SomeService> = SafeMock.build<SomeService>();

                mock.createSomethingNoArgs();
                mock.createSomethingNoArgs();

                expect(() => {
                    verify(mock.createSomethingNoArgs).never.called()
                }).to.throw("createSomethingNoArgs was called 2 times");
            });

            it('never.called() does not throw exception if no interaction occurred', () => {
                const mock: Mock<SomeService> = SafeMock.build<SomeService>();
                verify(mock.createSomethingNoArgs).never.called()
            });

            it('never.calledWith() exception if interaction occurred', () => {
                const mock: Mock<SomeService> = SafeMock.build<SomeService>();

                mock.createSomethingOneArg("call");
                mock.createSomethingOneArg("call");

                expect(() => {
                    verify(mock.createSomethingOneArg).never.calledWith("call")
                }).to.throw(`createSomethingOneArg was called 2 times with ("call")`);
            });


            it('never.calledWith() does not throw exception if no matching interaction occurred', () => {
                const mock: Mock<SomeService> = SafeMock.build<SomeService>();

                mock.createSomethingOneArg("differnent call");

                verify(mock.createSomethingOneArg).never.calledWith("call");
            });
        })
    });

    describe('building safe mock', () => {
        it('allows safe mock to be built from a class constructor', () => {
            class Blah {
                constructor(constructorArg: number) {
                }

                method() {
                    return ""
                }
            }

            const mock = SafeMock.build(Blah);

            when(mock.method).return("123");

            expect(mock.method()).to.eq("123");
        });
    });

    describe('resetMock()', () => {
        it('allows whole mocks to be reset', () => {
            const mock: Mock<SomeService> = SafeMock.build<SomeService>();

            mock.createSomethingOneArg("differnent call");

            mock.resetMock();

            verify(mock.createSomethingOneArg).never.called();
        });

        it('allows mock methods call counts to be reset', () => {
            const mock: Mock<SomeService> = SafeMock.build<SomeService>();

            mock.createSomethingOneArg("ignore me call");
            mock.createSomethingMultipleArgs("call", "call", "call");

            mock.createSomethingOneArg.resetMock();

            mock.createSomethingOneArg.resetMock();
            verify(mock.createSomethingOneArg).never.called();
            verify(mock.createSomethingMultipleArgs).called();
        });

        it('allows mock methods return values to be reset', () => {
            const mock: Mock<SomeService> = SafeMock.build<SomeService>();

            when(mock.createSomethingOneArg).return("this should be reset");

            mock.createSomethingOneArg.resetMock();

            expect(mock.createSomethingOneArg("")).not.to.eq("this should be reset");
        });


        it('allows mock mock functions to be reset', () => {
            function hello() {

            }

            const mockFunction = SafeMock.mockFunction(hello);

            mockFunction();

            mockFunction.resetMock();

            verify(mockFunction).never.called();
        });
    })
});
