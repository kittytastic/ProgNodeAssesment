const request = require('supertest');
const app = require('./app');

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

    test('GET /api/feedback includes fails with no args', () => {
        return request(app)
	    .get('/api/feedback')
	    .expect(/err/);
    });

    test('GET /api/feedback includes succeeds with args', () => {
        return request(app)
	    .get('/api/feedback?u_id=1&tt_id=1&c_id=all')
	    .expect(200);
    });

    test('GET /api/feedback includes gives good data with args', () => {
        return request(app)
	    .get('/api/feedback?u_id=1&tt_id=1?c_id=all')
	    .expect(/c_id/);
    });

    test('POST /api/feedback required u_id and tt_id', () => {
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

   

   /* test('GET /people/doctorwhocomposer includes name details', () => {
        return request(app)
	    .get('/people/doctorwhocomposer')
	    .expect(checkDeliaDerbyshire);
    });*/


});

