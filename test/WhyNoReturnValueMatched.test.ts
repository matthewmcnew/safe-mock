import WhyNoReturnValueMatched from "../src/WhyNoReturnValueMatched";
import ArgumentInvocation from "../src/ArgumentInvocation";
import ReturnValueMatcher from "../src/ReturnValueMatcher";
import {expect}from 'chai';

describe('WhyNoReturnValueMatched', () => {

    describe('reasonAndAdvice()', () => {
        it('includes  possible return values', () => {
            const whyNoReturnValueMatched = new WhyNoReturnValueMatched(
                new ArgumentInvocation([200]),
                [
                    new ReturnValueMatcher(new ArgumentInvocation([2]), "return value 2")
                ],
                'property'
            );

            const reason = whyNoReturnValueMatched.reasonAndAdvice();

            expect(reason).to.eq(
                "property was stubbed to return a value when called with (2) but was called with: (200)"
            )


        });


        it('includes multiple possible return values', () => {
            const whyNoReturnValueMatched = new WhyNoReturnValueMatched(
                new ArgumentInvocation([200]),
                [
                    new ReturnValueMatcher(new ArgumentInvocation([1]), "return value 1"),
                    new ReturnValueMatcher(new ArgumentInvocation([2]), "return value 2")
                ],
                'property'
            );

            const reason = whyNoReturnValueMatched.reasonAndAdvice();

            expect(reason).to.eq(
                "property was stubbed to return a value when called with (1) or (2) but was called with: (200)"
            )
        });

    });
});
