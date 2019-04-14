const request = require('supertest');
const app = require('./app');
const tt_tools = require('./tt_tools')

function checkDeliaDerbyshire(res)
{

    const jContent = res.body;
    if(typeof jContent !== 'object'){
	throw new Error('not an object');
    }

    if(jContent['surname'] !== 'Derbyshire'){
	console.log(jContent);
	throw new Error('surname should be Derbyshire');
    }

    if(jContent['forename'] !== 'Delia'){
	throw new Error('forename should be Delia');
    }
}

// thanks to Nico Tejera at https://stackoverflow.com/questions/1714786/query-string-encoding-of-a-javascript-object
// returns something like "access_token=concertina&username=bobthebuilder"
function serialise(obj){
    return Object.keys(obj).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`).join('&');
}

describe('Test the feedback service', () => {
    test('GET /api/feedback responds', () => {
        return request(app)
	    .get('/api/feedback')
	    .expect(400);
    });

    test('GET /api/feedback returns JSON', () => {
        return request(app)
	    .get('/api/feedback')
	    .expect('Content-type', /json/);
    });

    test('GET /api/feedback sends fail JSON with no arguments', () => {
        return request(app)
	    .get('/api/feedback')
	    .expect(/err/);
    });

    test('GET /api/feedback succeeds with arguments', () => {
        return request(app)
	    .get('/api/feedback?u_id=1&tt_id=1&c_id=all')
	    .expect(200);
    });

    test('GET /api/feedback gives good data with arguments', () => {
        return request(app)
	    .get('/api/feedback?u_id=1&tt_id=1?c_id=all')
	    .expect(/c_id/);
    });

    test('POST /api/feedback fails without u_id and tt_id', () => {
        const params = {title: 'Test Comment',
                comment: 'Words',};
            return request(app)
            .post('/api/feedback')
            .send(serialise(params))
            .expect(400);
        });

    test('POST /api/feedback succeeds with u_id and tt_id', () => {
        const params = {title: 'Test Comment',
                comment: 'Words',};
            return request(app)
            .post('/api/feedback?tt_id=0&u_id=0')
            .send(serialise(params))
            .expect(200);
        });

    test('DELETE /api/feedback fails with no arguments', () => {
        return request(app)
        .delete('/api/feedback')
        .expect(400);
    });

    test('DELETE /api/feedback succeeds with arguments', () => {
        return request(app)
        .delete('/api/feedback?u_id=0&tt_id=0&c_id=0')
        .expect(200);
    });

   

   /* test('GET /people/doctorwhocomposer includes name details', () => {
        return request(app)
	    .get('/people/doctorwhocomposer')
	    .expect(checkDeliaDerbyshire);
    });*/


});

describe('Test the timetable service', () => {
    test('GET /api/tt responds', () => {
        return request(app)
	    .get('/api/tt')
	    .expect(200);
    });

    test('GET /api/tt list user timetable responds', () => {
        return request(app)
	    .get('/api/tt?u_id=0')
	    .expect(200);
    });

    test('GET /api/tt get timetable responds', () => {
        return request(app)
	    .get('/api/tt?u_id=0&tt_id=0')
	    .expect(200);
    });


    test('POST /api/tt add TT succeeds with correct data', () => {
        const params = {name: "name of new timetable",
                start_day: 6,
                dur: 1};
            return request(app)
            .post('/api/tt?tt_id=0&u_id=0&new=yes')
            .send(serialise(params))
            .expect(200);
        });

    test('POST /api/tt add TT fails with incorrect data', () => {
        const params = {title: 'Test Comment',
                comment: 'Words',};
            return request(app)
            .post('/api/tt?tt_id=0&u_id=0&new=yes')
            .send(serialise(params))
            .expect(400);
        });
    
    test('POST /api/tt update TT fails with incorrect data', () => {
        const params = {title: 'Test Comment',
                comment: 'Words',};
            return request(app)
            .post('/api/tt?tt_id=0&u_id=0')
            .send(serialise(params))
            .expect(400);
        });
});