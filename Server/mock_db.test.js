/* eslint-env node, jest */
/* eslint no-mixed-spaces-and-tabs: ["error", "smart-tabs"] */


const db = require('./mock_db');

db.start();


describe('Load TT', () => {

    test('Returns TT', () => {
        expect(db.load_tt(0,0)).toBeTruthy();
    });

});

describe('Check and fix ', () => {

    test('Check function runs', () => {
        expect(db.check_and_fix_user_exist(100)).toBeTruthy();
    });

});
