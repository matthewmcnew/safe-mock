export default class CallsDontMatchError extends Error{
    constructor(expectedCall: any, otherInteractions: any[], methodName: PropertyKey) {
        super(`${methodName} was not called with: [${expectedCall}]
       Other interactions with this mock: [${otherInteractions.join(", ")}]`)
    }
}