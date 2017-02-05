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
import SafeMock, {when, verify} from "SafeMock";

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


## The Details
#### Creating Mocks

Mocks can be created from an interface, class, or function:

##### Creating Mocks of interfaces:
```typescript
import SafeMock, {Mock} from "SafeMock";

interface SomeService {
    createSomething(argument: number): string;
}

// Mock an interface by passing the type of the mock as a generic to the build method  
const mock: Mock<SomeService> = SafeMock.build<SomeService>();

// Typescript will infer the type so you don't need to specify the type of the mock:
const mock = SafeMock.build<SomeService>();
```

##### Creating Mocks of classes:
```typescript
import SafeMock, {Mock} from "SafeMock";

class SomeServiceClass {
    createSomething(argument: number) {
        return 106;
    }
}

// Mock a class by passing the class into the build method
const mock: Mock<SomeServiceClass> = SafeMock.build(SomeServiceClass);

// Mock a class by passing the type of the mock as a generic to the build method  
const mock: Mock<SomeServiceClass> = SafeMock.build<SomeServiceClass>();

// Typescript will infer the type so you don't need to specify the type of the mock:
const mock = SafeMock.build<SomeService>();
```

##### Creating Mocks of functions:
```typescript
import SafeMock, {Mock} from "SafeMock";

function someFunc() {
} 

// Mock a function by passing it into the mockFunction method 
const mockFunction = SafeMock.mockFunction(someFunc);

// if you have a type signature for a function you can use generics to create a mockFunction
type FunctionToMock = () => string;
const mockFunction = SafeMock.mockFunction<FunctionToMock>();

// you can pass a name into the mockFunction method to assist to make debugging easier
type FunctionToMock = () => string;
const mockFunction = SafeMock.mockFunction<FunctionToMock>("nameOfFunc");
```


#### Specifying behavior for Mocks
##### Setting Return Values

```typescript
import SafeMock, {Mock, when} from "SafeMock";

interface SomeService {
    someMethod(argument: number, otherArg: string): string;
}
const mock: Mock<SomeService> = SafeMock.build<SomeService>();

//specify return values only when mocks are called with certain arguments like this:
when(mock.someMethod(123, "some arg")).return("expectedReturn"); 

//If you don't care what arguments a mock receives you can specify a return value for all calls
when(mock.someMethod).return("expectedReturn"); 
```

##### Making Mocks throw Exceptions

```typescript
import SafeMock, {Mock, when} from "SafeMock";

interface SomeService {
    someMethod(argument: number, otherArg: string): string;
}
const mock: Mock<SomeService> = SafeMock.build<SomeService>();

//specify thrown exceptions only when mocks are called with certain arguments like this:
when(mock.someMethod(123, "some arg")).throw(new Error("BRR! Its cold!")); 

//If you don't care what arguments a mock receives you can specify a thrown exceptions for all calls:
when(mock.someMethod).throw(new Error("BRR! Its cold!")); 
```

#### Verifying behavior with mocks:

##### Verify that the correct arguments were used:
```typescript
import SafeMock, {verify} from "SafeMock";

interface SomeService {
    someMethod(argument: number, otherArg: string): string;
}
const mock = SafeMock.build<SomeService>();

//use verify to check the arguments to a method
verify(mock.someMethod).calledWith(123, "someArg");
```

##### Verify that mocks were never called
```typescript
import SafeMock, {verify} from "SafeMock";

interface SomeService {
    someMethod(argument: number): string;
}
const mock = SafeMock.build<SomeService>();

//use verify to check the arguments to a method
verify(mock.someMethod).never.calledWith(123)
```

##### Verify that a mock with no arguments was called.
```typescript
import SafeMock, {verify} from "SafeMock";

interface SomeService {
    someMethod(): string;
}
const mock = SafeMock.build<SomeService>();

//use verify to assert that 
verify(mock.someMethod).called()
```

##### Verify mock functions were called
```typescript
import SafeMock, {verify} from "SafeMock";

function someFunction() {
}

const mockFunction = SafeMock.mockFunction(someFunction);

//use verify just like mock methods on a mock object
verify(mockFunction).called()
```

## Rely On the Typescript Compiler to prevent mistakes. 

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
