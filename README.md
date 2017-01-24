Safe Mock [![Build Status](https://travis-ci.org/matthewmcnew/safe-mock.svg?branch=master)](https://travis-ci.org/matthewmcnew/safe-mock)
===================

Mock Library for typescript that allows mocks to be created from typescript interfaces and utilized in a typesafe dsl.

### Use Safe Mock like this:


##### Mock Return Value Based on Arguments

```typescript
interface SomeService {
    createSomething(argument: number): string;
}

const mock: Mock<SomeService> = SafeMock.build<SomeService>();

when(mock.createSomething(1)).return("one");
when(mock.createSomething(2)).return("two");

mock.createSomething(2) // two
mock.createSomething(1) // one
```

##### Verify Calls

```typescript
interface SomeService {
    createSomething(argument: number): string;
}

const mock: Mock<SomeService> = SafeMock.build<SomeService>();

mock.createSomething(456)

verify(mock.createSomething).calledWith(123); // Error! createSomething never called with 123 only [456]
```

##### Rely On the Typescript Compiler to prevent mistakes. 

```typescript
interface SomeService {
    createSomething(): string;
}

const mock: Mock<SomeService> = SafeMock.build<SomeService>();

when(mock.createSomething()).return(123); //Won't compile createSomething returns a string
```


```typescript
interface SomeService {
    createSomethingNoArgs(): string;
}

const mock: Mock<SomeService> = SafeMock.build<SomeService>();

mock.createSomethingNoArgs();

verify(mock.createSomethingNoArgs).calledWith(123); //Won't compile createSomething takes no args
```


```typescript
const notAMock = {
    blah() {}
};

verify(notAMock.blah).called(); //Won't compile notAMock.blah is not a mock
```
