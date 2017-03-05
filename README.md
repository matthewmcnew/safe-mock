Safe Mock [![Build Status](https://travis-ci.org/matthewmcnew/safe-mock.svg?branch=master)](https://travis-ci.org/matthewmcnew/safe-mock)
===================

Safe Mock is a library for Typescript (or Javascript) that allows mocks to be created from typescript interfaces or classes and utilized with simple typesafe syntax.

The syntax is inspired by Mockito.

Check out the examples below to get started:

### Quick Start

```bash
npm install safe-mock
```

Then import it in your tests:

```typescript
import SafeMock, {when, verify} from "safe-mock";

```

Create your first Safe Mock like this:

```typescript
interface SomeService {
    generate(key: string): string;
}

const mockSomeService = SafeMock.build<SomeService>();

```

Configure the mock to return values using SafeMock's `when`

```typescript
when(mockSomeService.mockSomeService("key")).return("generatedKey");
when(mockSomeService.mockSomeService("other")).return("otherGeneratedKey");

```

Assert that mocks were used correctly with SafeMock's `verify`

```typescript
verify(mock.mockSomeService).calledWith("key");
```
### Gotchas
* SafeMock requires TypeScript 2.1 or later.
* SafeMock requires a Javascript runtime with support for the [proxy object](http://caniuse.com/#feat=proxy).
* If running on Node.js version 6+ is required.

## The Details
### Creating mocks

Mocks can be created from an interface, class, or functions.

##### Creating mocks of interfaces
```typescript
import SafeMock, {Mock} from "safe-mock";

interface SomeService {
    createSomething(argument: number): string;
}

// mock an interface by passing the type of the mock as a generic to the build method  
const mock: Mock<SomeService> = SafeMock.build<SomeService>();

// Typescript will infer the type so you don't need to specify the type of the mock
const mock = SafeMock.build<SomeService>();
```

##### Creating Mocks of classes
```typescript
import SafeMock, {Mock} from "safe-mock";

class SomeServiceClass {
    createSomething(argument: number) {
        return 106;
    }
}

// mock a class by passing the class into the build method
const mock: Mock<SomeServiceClass> = SafeMock.build(SomeServiceClass);

// mock a class by passing the type of the mock as a generic to the build method  
const mock: Mock<SomeServiceClass> = SafeMock.build<SomeServiceClass>();

//Typescript will infer the type so you don't need to specify the type of the mock
const mock = SafeMock.build<SomeService>();
```

##### Creating Mocks of functions
```typescript
import SafeMock, {Mock} from "safe-mock";

function someFunc() {
} 

// Mock a function by passing it into the mockFunction method 
const mockFunction = SafeMock.mockFunction(someFunc);

// if you have a type signature for a function you can use generics to create a mockFunction
type FunctionToMock = () => string;
const mockFunction = SafeMock.mockFunction<FunctionToMock>();

// you can pass a name into the mockFunction method to make debugging easier
type FunctionToMock = () => string;
const mockFunction = SafeMock.mockFunction<FunctionToMock>("nameOfFunc");
```


### Specifying behavior for mocks
##### Setting Return Values

```typescript
import SafeMock, {Mock, when} from "safe-mock";

interface SomeService {
    someMethod(argument: number, otherArg: string): string;
}
const mock: Mock<SomeService> = SafeMock.build<SomeService>();

// specify return values only when mocks are called with certain arguments like this
when(mock.someMethod(123, "some arg")).return("expectedReturn"); 

// if you don't care what arguments a mock receives you can specify a return value for all calls
when(mock.someMethod).return("expectedReturn"); 
```

##### Making mocks throw Exceptions

```typescript
import SafeMock, {Mock, when} from "safe-mock";

interface SomeService {
    someMethod(argument: number, otherArg: string): string;
}
const mock: Mock<SomeService> = SafeMock.build<SomeService>();

// specify thrown exceptions only when mocks are called with certain arguments like this
when(mock.someMethod(123, "some arg")).throw(new Error("BRR! Its cold!")); 

//if you don't care what arguments a mock receives you can specify a thrown exceptions for all calls
when(mock.someMethod).throw(new Error("BRR! Its cold!")); 
```

##### Working with mocks that return a Promise 

```typescript
import SafeMock, {Mock, when} from "safe-mock";

interface SomeService {
    someMethod(argument: number): Promise<string>;
}
const mock: Mock<SomeService> = SafeMock.build<SomeService>();

// specify that the mock returns rejected promises with a rejected value with reject
when(mock.someMethod(123)).reject(new Error("BRR! Its cold!"));

mock.someMethod(123); //returns Promise.reject(new Error("BRR! Its cold!"));

// specify that the mock returns resolved promises with resolve
when(mock.someMethod(124)).resolve("Hooray! You passed in 124"); 

mock.someMethod(124); //returns Promise.resolve("Hooray! You passed in 124");
```
Note: resolve() and reject() are only available on mocks that return a Promise.

### Verifying behavior with mocks

##### Verify that the correct arguments were used
```typescript
import SafeMock, {verify} from "safe-mock";

interface SomeService {
    someMethod(argument: number, otherArg: string): string;
}
const mock = SafeMock.build<SomeService>();

//use verify.calledWith to check the exact arguments to a mocked method
verify(mock.someMethod).calledWith(123, "someArg");

//use verify.called() to check that a mock was called at least once
verify(mock.someMethod).called();
```

##### Verify that mocks were never called
```typescript
import SafeMock, {verify} from "safe-mock";

interface SomeService {
    someMethod(argument: number): string;
}
const mock = SafeMock.build<SomeService>();

//use verify.never to check that a method was never called with any arguments.
verify(mock.someMethod).never.called();

//use verify.never.calledWith to check that a mock was never called with specific arguments
verify(mock.someMethod).never.calledWith(123);
```

### Reset-ing mocks

##### Use resetMock() to reset call information and mocked behavior
```typescript
import SafeMock, {verify} from "safe-mock";

interface SomeService {
    someMethod(argument: number, otherArg: string): string;
    someOtherMethod(): string;
}
const mock = SafeMock.build<SomeService>();

//use resetMock() to a reset all methods on a mock
mock.resetMock()

//use resetMock() on an individual method to only reset that method
mock.someOtherMethod.resetMock()
```


### Use mock functions just like mocked methods.
```typescript
import SafeMock, {verify, when} from "safe-mock";

function someFunction() {
    return "string"
}

const mockFunction = SafeMock.mockFunction(someFunction);

when(mockFunction).return("return vlause");
verify(mockFunction).called()
someOtherMethod.resetMock();
```

## Rely On the Typescript Compiler to prevent mistakes 

SafeMock won't let you return the wrong type from mocks.
```typescript
interface SomeService {
    createSomething(): string;
}

const mock: Mock<SomeService> = SafeMock.build<SomeService>();

//Won't compile createSomething returns a string
when(mock.createSomething()).return(123); 
```

SafeMock won't let you verify arguments of the wrong type.
```typescript
interface SomeService {
    createSomethingWithAString(argument: string): string;
}

const mock: Mock<SomeService> = SafeMock.build<SomeService>();

mock.createSomethingNoArgs();

//Won't compile, createSomething takes a string
verify(mock.createSomethingNoArgs).calledWith(123); 
```

SafeMock won't let you verify the wrong number of arguments.
```typescript
interface SomeService {
    createSomethingNoArgs(): string;
}

const mock: Mock<SomeService> = SafeMock.build<SomeService>();

mock.createSomethingNoArgs();

//Won't compile, createSomething takes no args
verify(mock.createSomethingNoArgs).calledWith(123); 
```

SafeMock won't let you verify non mocked methods.
```typescript
const notAMock = {
    blah() {}
};

//Won't compile notAMock.blah is not a mock
verify(notAMock.blah).called(); 
```
