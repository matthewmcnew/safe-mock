import ArgumentInvocation from "./ArgumentInvocation";
import {ArgumentInvocationMatcher} from "./StubbedActionMatcher";

export default class AnyArgsMatch implements ArgumentInvocationMatcher {
    prettyPrint(): string {
        return "[Any Args]";
    }

    equivalentTo(expectedCall: ArgumentInvocation): boolean {
        return true;
    }

}
