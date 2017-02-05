import {nameFunc} from "../src/functionNamer";
import {expect} from "chai";

describe('functionName', () => {

    it('returns name if available', () => {
        function blah(){
        }

        expect(nameFunc(blah)).to.eq('blah')
    });

    it('returns name if passed in', () => {
        expect(nameFunc("someName")).to.eq("someName")
    });


    it('returns mockedFunction if nothing is passed in', () => {
        expect(nameFunc()).to.eq('mockedFunction')
    });

    it('returns mockedFunction if anonymous function is passed in', () => {
        expect(nameFunc(()=> {})).to.eq('mockedFunction')
    });


    it('returns mockedFunction if non function is passed in', () => {
        expect(nameFunc(<any>{})).to.eq('mockedFunction')
    });

});
