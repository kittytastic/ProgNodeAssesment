/* eslint-env node, jest */
/* eslint no-mixed-spaces-and-tabs: ["error", "smart-tabs"] */


const tt_tools = require('./tt_tools');


let good_meta = {
    start_day: 0,
    name: "name"
}

let good_ts = [
    {
        start:0,
        end:1,
        session:0
    },
    {
        start:22,
        end:23,
        session:0
    }
]

let good_days = [good_ts, good_ts]

let good_sesh = {
    col: "#ff00ff",
    title: "Name",
    status: 0
}

let good_sessions = [good_sesh, good_sesh]





describe('Test TT tools verify function', () => {

    test('Passes with good object', () => {
        expect(tt_tools.validate({days:good_days, session_type:good_sessions, meta:good_meta})).toBe(true);
    });

	test('Fails with no object', () => {
        expect(tt_tools.validate()).toBe(false);
    });
    
    test('Requires child day object', () => {
        expect(tt_tools.validate({session_type:good_sessions, meta:good_meta})).toBe(false);
    });
    
    test('Requires child session type object', () => {
        expect(tt_tools.validate({days:good_days, meta:good_meta})).toBe(false);
    });
    
    test('Requires child meta data object', () => {
        expect(tt_tools.validate({days:good_days, session_type:good_sessions})).toBe(false);
    });
    
    test('Valid timeslot works', () => {
        expect(tt_tools.lvts({start:0, end:1, session:0})).toBe(true);
    });
    
    test('Valid timeslot catches minus time', () => {
        expect(tt_tools.lvts({start:-1, end:1, session:0})).toBe(false);
    });
    
    test('Valid timeslot catches negative duration', () => {
        expect(tt_tools.lvts({start:2, end:1, session:0})).toBe(false);
    });
    
    test('Valid timeslot catches time past end of day', () => {
        expect(tt_tools.lvts({start:0, end:25, session:0})).toBe(false);
    });
    
	
});

describe('Test TT tools new_tt function', () => {

    test('Passes with good object', () => {
        expect(tt_tools.validate(tt_tools.new_tt("blar", 0, 5))).toBe(true);
    });

	
});