/* eslint-env node, jest */
/* eslint no-mixed-spaces-and-tabs: ["error", "smart-tabs"] */

const request = require('supertest');
const app = require('./app');
//const tt_tools = require('./tt_tools');

/*
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
}*/

// thanks to Nico Tejera at https://stackoverflow.com/questions/1714786/query-string-encoding-of-a-javascript-object
// returns something like "access_token=concertina&username=bobthebuilder"
function serialise(obj){
	return Object.keys(obj).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`).join('&');
}



/* test('GET /people/doctorwhocomposer includes name details', () => {
	return request(app)
	.get('/people/doctorwhocomposer')
	.expect(checkDeliaDerbyshire);
});*/




describe('Test LIST ALL timetable endpoint (GET /api/tt)', () => {

	test('Responds with correct code', () => {
		return request(app)
	    .get('/api/tt')
	    .expect(200);
	});

	test('Returns JSON', () => {
	    return request(app)
	    .get('/api/tt')
	    .expect('Content-type', /json/);
	});

	test('Gives good data - has tt_id', () => {
		return request(app)
	    .get('/api/tt')
	    .expect(/tt_id/);
	});

	test('Gives good data - has u_id', () => {
		return request(app)
	    .get('/api/tt')
	    .expect(/u_id/);
	});

	test('Gives good data - has name', () => {
		return request(app)
	    .get('/api/tt')
	    .expect(/title/);
	});

	
});



describe('Test LIST timetable FOR USER endpoint (GET /api/tt?u_id=(number))', () => {

	test('Responds with correct code', () => {
		return request(app)
	    .get('/api/tt?u_id=0')
	    .expect(200);
	});

	test('Returns with JSON', () => {
	    return request(app)
	    .get('/api/tt?u_id=0')
	    .expect('Content-type', /json/);
	});

	test('Error with u_id wrong data type (string)', () => {
		return request(app)
	    .get('/api/tt?u_id=blar')
			.expect(400)
			.expect('Content-type', /json/)
			.expect(/err/);
	});

	test('Forces int with u_id wrong data type (float)', () => {
		return request(app)
	    .get('/api/tt?u_id=2.34')
	    .expect(200);
	});

	test('Error with u_id out of range', () => {
		return request(app)
	    .get('/api/tt?u_id=10000000000')
			.expect(400)
			.expect('Content-type', /json/)
			.expect(/err/);
	});

	test('Gives good data - has tt_id', () => {
		return request(app)
	    .get('/api/tt?u_id=0')
	    .expect(/tt_id/);
	});

	test('Gives good data - has u_id', () => {
		return request(app)
	    .get('/api/tt?u_id=0')
	    .expect(/u_id/);
	});

	test('Gives good data - has name', () => {
		return request(app)
	    .get('/api/tt?u_id=0')
	    .expect(/title/);
	});
	
});



describe('Test GET timetable data endpoint (GET /api/tt?u_id=(#)&tt_id=(#)', () => {

	test('Responds with correct code', () => {
		return request(app)
	    .get('/api/tt?u_id=0&tt_id=0')
	    .expect(200);
	});

	test('Returns with JSON', () => {
	    return request(app)
	    .get('/api/tt?u_id=0&tt_id=0')
	    .expect('Content-type', /json/);
	});

	test('Error without u_id', () => {
		return request(app)
	    .get('/api/tt?tt_id=0')
			.expect(400)
			.expect('Content-type', /json/)
			.expect(/err/);
	});

	test('Error with u_id wrong data type (string)', () => {
		return request(app)
	    .get('/api/tt?u_id=blar&tt_id=0')
			.expect(400)
			.expect('Content-type', /json/)
			.expect(/err/);
	});

	test('Forces int with u_id wrong data type (float)', () => {
		return request(app)
	    .get('/api/tt?u_id=2.34&tt_id=0')
	    .expect(200);
	});

	test('Error with u_id out of range', () => {
		return request(app)
	    .get('/api/tt?u_id=10000000000&tt_id=0')
			.expect(400)
			.expect('Content-type', /json/)
			.expect(/err/);
	});

	test('Error with tt_id wrong data type (string)', () => {
		return request(app)
	    .get('/api/tt?u_id=0&tt_id=blar')
			.expect(400)
			.expect('Content-type', /json/)
			.expect(/err/);
	});

	test('Forces int with tt_id wrong data type (float)', () => {
		return request(app)
	    .get('/api/tt?u_id=0&tt_id=0.1')
	    .expect(200);
	});

	test('Error with tt_id out of range', () => {
		return request(app)
	    .get('/api/tt?u_id=0&tt_id=10000000000')
			.expect(400)
			.expect('Content-type', /json/)
			.expect(/err/);
	});

	
	
});



describe('Test UPDATE timetable endpoint', () => {
	test('Fails without auth data', () => {
		const params = {title: 'Test Comment',
			comment: 'Words',};
		return request(app)
			.post('/api/tt?tt_id=0&u_id=0')
			.send(serialise(params))
			.expect(403);
	});
	
});



describe('Test ADD timetable endpoint', () => {

	test('Fails without auth data', () => {
		const params = {title: 'Test Comment',
			comment: 'Words',};
		return request(app)
			.post('/api/tt?tt_id=0&u_id=0&new=yes')
			.send(serialise(params))
			.expect(403);
	});

	/*test('POST /api/tt - ADD TT succeeds with the correct data', () => {
		const params = {name: 'name of new timetable',
			start_day: 6,
			dur: 1};
		return request(app)
			.post('/api/tt?tt_id=0&u_id=0&new=yes')
			.send(serialise(params))
			.expect(200);
	});

	test('POST /api/tt - ADD TT fails with incorrect data', () => {
		const params = {title: 'Test Comment',
			comment: 'Words',};
		return request(app)
			.post('/api/tt?tt_id=0&u_id=0&new=yes')
			.send(serialise(params))
			.expect(400);
	});*/
	
});



describe('Test GET feedback for specified TT endpoint (GET /api/feedback)', () => {

	test('Succeeds with arguments', () => {
		return request(app)
	    .get('/api/feedback?u_id=1&tt_id=1&c_id=all')
	    .expect(200);
	});

	test('Gives good data with arguments', () => {
		return request(app)
	    .get('/api/feedback?u_id=1&tt_id=1&c_id=all')
	    .expect(/c_id/);
	});
	
	test('Error with no arguments', () => {
	    return request(app)
	    .get('/api/feedback')
			.expect(400)
			.expect('Content-type', /json/)
			.expect(/err/);
	});

	test('Error with tt_id arguments', () => {
	    return request(app)
	    .get('/api/feedback?u_id=0&c_id=all')
			.expect(400)
			.expect('Content-type', /json/)
			.expect(/err/);
	});

	test('Error with tt_id wrong data type (string)', () => {
		return request(app)
	    .get('/api/feedback?u_id=0&tt_id=blar&c_id=all')
			.expect(400)
			.expect('Content-type', /json/)
			.expect(/err/);
	});

	test('Forces int with tt_id wrong data type (float)', () => {
		return request(app)
	    .get('/api/feedback?u_id=0&tt_id=0.1&c_id=all')
	    .expect(200);
	});

	test('Error with tt_id out of range', () => {
		return request(app)
	    .get('/api/feedback?u_id=0&tt_id=10000000000&c_id=all')
			.expect(400)
			.expect('Content-type', /json/)
			.expect(/err/);
	});
	
	test('Error with u_id arguments', () => {
	    return request(app)
	    .get('/api/feedback?tt_id=0&c_id=all')
			.expect(400)
			.expect('Content-type', /json/)
			.expect(/err/);
	});

	test('Error with u_id wrong data type (string)', () => {
		return request(app)
	    .get('/api/feedback?u_id=blar&tt_id=0&c_id=all')
			.expect(400)
			.expect('Content-type', /json/)
			.expect(/err/);
	});

	test('Forces int with u_id wrong data type (float)', () => {
		return request(app)
	    .get('/api/feedback?u_id=2.34&tt_id=0&c_id=all')
	    .expect(200);
	});

	test('Error with u_id out of range', () => {
		return request(app)
	    .get('/api/feedback?u_id=10000000000&tt_id=0&c_id=all')
			.expect(400)
			.expect('Content-type', /json/)
			.expect(/err/);
	});
	
	test('Error without c_id arguments', () => {
	    return request(app)
	    .get('/api/feedback?u_id=0&tt_id=0')
			.expect(400)
			.expect('Content-type', /json/)
			.expect(/err/);
	});

	test('Error with c_id wrong data (random string)', () => {
		return request(app)
	    .get('/api/feedback?u_id=blar&tt_id=0&c_id=blar')
			.expect(400)
			.expect('Content-type', /json/)
			.expect(/err/);
	});

	test('Error with u_id wrong data type (int)', () => {
		return request(app)
	    .get('/api/feedback?u_id=blar&tt_id=0&c_id=0')
			.expect(400)
			.expect('Content-type', /json/)
			.expect(/err/);
	});

	
});



describe('Test GET single feedback comment endpoint', () => {

	test('Succeeds with arguments', () => {
		return request(app)
	    .get('/api/feedback?u_id=1&tt_id=1&c_id=0')
	    .expect(200);
	});

	test('Gives good data with arguments', () => {
		return request(app)
	    .get('/api/feedback?u_id=1&tt_id=1&c_id=0')
	    .expect(/c_id/);
	});
	
	test('Error with no arguments', () => {
	    return request(app)
	    .get('/api/feedback')
			.expect(400)
			.expect('Content-type', /json/)
			.expect(/err/);
	});

	test('Error with tt_id arguments', () => {
	    return request(app)
	    .get('/api/feedback?u_id=0&c_id=0')
			.expect(400)
			.expect('Content-type', /json/)
			.expect(/err/);
	});

	test('Error with tt_id wrong data type (string)', () => {
		return request(app)
	    .get('/api/feedback?u_id=0&tt_id=blar&c_id=0')
			.expect(400)
			.expect('Content-type', /json/)
			.expect(/err/);
	});

	test('Forces int with tt_id wrong data type (float)', () => {
		return request(app)
	    .get('/api/feedback?u_id=0&tt_id=0.1&c_id=0')
	    .expect(200);
	});

	test('Error with tt_id out of range', () => {
		return request(app)
	    .get('/api/feedback?u_id=0&tt_id=10000000000&c_id=0')
			.expect(400)
			.expect('Content-type', /json/)
			.expect(/err/);
	});
	
	test('Error with u_id arguments', () => {
	    return request(app)
	    .get('/api/feedback?tt_id=0&c_id=0')
			.expect(400)
			.expect('Content-type', /json/)
			.expect(/err/);
	});

	test('Error with u_id wrong data type (string)', () => {
		return request(app)
	    .get('/api/feedback?u_id=blar&tt_id=0&c_id=0')
			.expect(400)
			.expect('Content-type', /json/)
			.expect(/err/);
	});

	test('Forces int with u_id wrong data type (float)', () => {
		return request(app)
	    .get('/api/feedback?u_id=2.34&tt_id=0&c_id=0')
	    .expect(200);
	});

	test('Error with u_id out of range', () => {
		return request(app)
	    .get('/api/feedback?u_id=10000000000&tt_id=0&c_id=0')
			.expect(400)
			.expect('Content-type', /json/)
			.expect(/err/);
	});
	
	test('Error without c_id arguments', () => {
	    return request(app)
	    .get('/api/feedback?u_id=0&tt_id=0')
			.expect(400)
			.expect('Content-type', /json/)
			.expect(/err/);
	});

	test('Error with c_id wrong data type (string)', () => {
		return request(app)
	    .get('/api/feedback?u_id=0&tt_id=0&c_id=blar')
			.expect(400)
			.expect('Content-type', /json/)
			.expect(/err/);
	});

	test('Forces int with c_id wrong data type (float)', () => {
		return request(app)
	    .get('/api/feedback?u_id=0&tt_id=0&c_id=0.4')
	    .expect(200);
	});

	test('Error with c_id out of range', () => {
		return request(app)
	    .get('/api/feedback?u_id=0&tt_id=0&c_id=10000000000')
			.expect(400)
			.expect('Content-type', /json/)
			.expect(/err/);
	});
	
});



describe('Test POST feedback endpoint', () => {

	test('POST /api/feedback succeeds with u_id and tt_id', () => {
		const params = {title: 'Test Comment',
			comment: 'Words',};
		return request(app)
			.post('/api/feedback?tt_id=0&u_id=0')
			.send(serialise(params))
			.expect(200);
	});

	test('POST /api/feedback fails without u_id and tt_id', () => {
		const params = {title: 'Test Comment',
			comment: 'Words',};
		return request(app)
			.post('/api/feedback')
			.send(serialise(params))
			.expect(400);
	});
	
});



describe('Test DELETE timetable endpoint', () => {

	test('DELETE /api/feedback succeeds with arguments', () => {
		return request(app)
			.delete('/api/feedback?u_id=0&tt_id=0&c_id=0')
			.expect(200);
	});
	
	test('DELETE /api/feedback fails with no arguments', () => {
		return request(app)
			.delete('/api/feedback')
			.expect(400);
	});


});