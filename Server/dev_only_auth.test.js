/* eslint-env node, jest */
/* eslint no-mixed-spaces-and-tabs: ["error", "smart-tabs"] */


const doa = require('./dev_only_auth.js');




describe('Test Verify function', () => {

    test('Passes with good data', () => {
        expect(doa.verify(0,0)).toBe(true);
    });

    test('Fails if user doesn\'t exist', () => {
        expect(doa.verify(110,0)).toBe(false);
    });

    test('Fails with wrong token', () => {
        expect(doa.verify(0,10)).toBe(false);
    });

});

describe('Test getUID function', () => {

    test('Returns correct user for hash', () => {
        expect(doa.getUID(0)).toBe(0);
    });

    test('Adds user if hash doesn\'t exist', () => {
        expect(doa.getUID(110)).toBe(1);
    });


});


describe('Test first Verify function', () => {

    test('Fail with bad token', done => {

        function fail(data){
            expect(data).toBeDefined();
            done();
        }

        doa.first_verify(0, null, fail)
    });



});

