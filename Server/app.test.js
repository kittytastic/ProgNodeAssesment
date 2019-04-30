/* eslint-env node, jest */
/* eslint no-mixed-spaces-and-tabs: ["error", "smart-tabs"] */

const request = require('supertest');
const app = require('./app');
const tt_tools = require('./tt_tools');



// thanks to Nico Tejera at https://stackoverflow.com/questions/1714786/query-string-encoding-of-a-javascript-object
// returns something like "access_token=concertina&username=bobthebuilder"
function serialise(obj){
	return Object.keys(obj).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`).join('&');
}


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
	    .get('/api/tt?u_id=0.34')
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
	    .get('/api/tt?u_id=0.34&tt_id=0')
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

	test('Fails with bad data', () => {
		const params = {title: 'Test Comment',
			comment: 'Words',};
		return request(app)
			.post('/api/tt?tt_id=0&u_id=0&auth=0')
			.send(serialise(params))
			.expect(400);
	});

	test('Success with good data', () => {
		return request(app)
			.post('/api/tt?tt_id=0&u_id=0&auth=0')
			.send(serialise(tt_tools.new_tt("name", 0, 2)))
			.expect(200);
	});

	test('Fails with no tt_id', () => {
		return request(app)
			.post('/api/tt?&u_id=0&auth=0')
			.send(serialise(tt_tools.new_tt("name", 0, 2)))
			.expect(400);
	});

	test('Fails with tt_id wrong type (string)', () => {
		return request(app)
			.post('/api/tt?tt_id=blar&u_id=0&auth=0')
			.send(serialise(tt_tools.new_tt("name", 0, 2)))
			.expect(400);
	});

	test('Forces tt_id to int', () => {
		return request(app)
			.post('/api/tt?tt_id=0.2&u_id=0&auth=0')
			.send(serialise(tt_tools.new_tt("name", 0, 2)))
			.expect(200);
	});

	test('Fails with tt_id out of range', () => {
		return request(app)
			.post('/api/tt?tt_id=1000000&u_id=0&auth=0')
			.send(serialise(tt_tools.new_tt("name", 0, 2)))
			.expect(400);
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

	test('POST /api/tt - ADD TT succeeds with the correct data', () => {
		const params = {name: 'name of new timetable',
			start_day: 6,
			dur: 1};
		return request(app)
			.post('/api/tt?tt_id=0&u_id=0&new=yes&auth=0')
			.send(serialise(params))
			.expect(200);
	});

	test('POST /api/tt - ADD TT fails with incorrect data', () => {
		const params = {title: 'Test Comment',
			comment: 'Words',};
		return request(app)
			.post('/api/tt?tt_id=0&u_id=0&new=yes&auth=0')
			.send(serialise(params))
			.expect(400);
	});
	
});



describe('Test GET feedback for specified TT endpoint (GET /api/feedback)', () => {

	test('Succeeds with arguments', () => {
		return request(app)
	    .get('/api/feedback?u_id=0&tt_id=0&c_id=all')
	    .expect(200);
	});

	test('Gives good data with arguments', () => {
		return request(app)
	    .get('/api/feedback?u_id=0&tt_id=0&c_id=all')
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
	    .get('/api/feedback?u_id=0.34&tt_id=0&c_id=all')
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
	    .get('/api/feedback?u_id=0&tt_id=0&c_id=0')
	    .expect(200);
	});

	test('Gives good data with arguments', () => {
		return request(app)
	    .get('/api/feedback?u_id=0&tt_id=0&c_id=0')
	    .expect(/c_id/);
	});
	
	test('Error with no arguments', () => {
	    return request(app)
	    .get('/api/feedback')
			.expect(400)
			.expect('Content-type', /json/)
			.expect(/err/);
	});

	test('Error with no tt_id arguments', () => {
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
	
	test('Error with no u_id arguments', () => {
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
	    .get('/api/feedback?u_id=0.34&tt_id=0&c_id=0')
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



describe('Test POST feedback endpoint (/api/feedback)', () => {

	test('Succeeds with u_id and tt_id', () => {
		const params = {title: 'Test Comment',
			comment: 'Words',};
		return request(app)
			.post('/api/feedback?tt_id=0&u_id=0')
			.send(serialise(params))
			.expect(200);
	});

	test('Error without both arguments u_id and tt_id', () => {
		const params = {title: 'Test Comment',
			comment: 'Words',};
		return request(app)
			.post('/api/feedback')
			.send(serialise(params))
			.expect(400);
	});

	test('Error without tt_id arguments', () => {
	    const params = {title: 'Test Comment',
			comment: 'Words',};
		return request(app)
			.post('/api/feedback?u_id=0')
			.send(serialise(params))
			.expect(400)
			.expect('Content-type', /json/)
			.expect(/err/);
	});

	test('Error with tt_id wrong data type (string)', () => {
		const params = {title: 'Test Comment',
			comment: 'Words',};
		return request(app)
			.post('/api/feedback?tt_id=balr&u_id=0')
			.send(serialise(params))
			.expect(400)
			.expect('Content-type', /json/)
			.expect(/err/);
	});

	test('Forces int with tt_id wrong data type (float)', () => {
		const params = {title: 'Test Comment',
			comment: 'Words',};
		return request(app)
			.post('/api/feedback?tt_id=0.3&u_id=0')
			.send(serialise(params))
	    .expect(200);
	});

	test('Error with tt_id out of range', () => {
		const params = {title: 'Test Comment',
			comment: 'Words',};
		return request(app)
			.post('/api/feedback?tt_id=100000000&u_id=0')
			.send(serialise(params))
			.expect(400)
			.expect('Content-type', /json/)
			.expect(/err/);
	});
	
	test('Error without u_id arguments', () => {
	    const params = {title: 'Test Comment',
			comment: 'Words',};
		return request(app)
			.post('/api/feedback?tt_id=0')
			.send(serialise(params))
			.expect(400)
			.expect('Content-type', /json/)
			.expect(/err/);
	});

	test('Error with u_id wrong data type (string)', () => {
		const params = {title: 'Test Comment',
			comment: 'Words',};
		return request(app)
			.post('/api/feedback?tt_id=0&u_id=blar')
			.send(serialise(params))
			.expect(400)
			.expect('Content-type', /json/)
			.expect(/err/);
	});

	test('Forces int with u_id wrong data type (float)', () => {
		const params = {title: 'Test Comment',
			comment: 'Words',};
		return request(app)
			.post('/api/feedback?tt_id=0&u_id=0.2')
			.send(serialise(params))
	    .expect(200);
	});

	test('Error with u_id out of range', () => {
		const params = {title: 'Test Comment',
			comment: 'Words',};
		return request(app)
			.post('/api/feedback?tt_id=0&u_id=10000000')
			.send(serialise(params))
			.expect(400)
			.expect('Content-type', /json/)
			.expect(/err/);
	});
	
});



describe('Test DELETE comment endpoint', () => {


	test('Requires authentication', () => {
		return request(app)
			.delete('/api/feedback?u_id=0&tt_id=0&c_id=0')
			.expect(403);
	});

	test('Success with authentication', () => {
		return request(app)
			.delete('/api/feedback?u_id=0&tt_id=0&c_id=0&auth=0')
			.expect(200);
	});

	test('Requires arguments', () => {
		return request(app)
			.delete('/api/feedback')
			.expect(400);
	});

	test('Error with no tt_id arguments', () => {
	    return request(app)
	    .delete('/api/feedback?u_id=0&c_id=0')
			.expect(400)
			.expect('Content-type', /json/)
			.expect(/err/);
	});

	test('Error with tt_id wrong data type (string)', () => {
		return request(app)
	    .delete('/api/feedback?u_id=0&tt_id=blar&c_id=0')
			.expect(400)
			.expect('Content-type', /json/)
			.expect(/err/);
	});

	
	test('Error with no u_id arguments', () => {
	    return request(app)
	    .delete('/api/feedback?tt_id=0&c_id=0')
			.expect(400)
			.expect('Content-type', /json/)
			.expect(/err/);
	});

	test('Error with u_id wrong data type (string)', () => {
		return request(app)
	    .delete('/api/feedback?u_id=blar&tt_id=0&c_id=0')
			.expect(400)
			.expect('Content-type', /json/)
			.expect(/err/);
	});

	
	
	test('Error without c_id arguments', () => {
	    return request(app)
	    .delete('/api/feedback?u_id=0&tt_id=0')
			.expect(400)
			.expect('Content-type', /json/)
			.expect(/err/);
	});

	test('Error with c_id wrong data type (string)', () => {
		return request(app)
	    .delete('/api/feedback?u_id=0&tt_id=0&c_id=blar')
			.expect(400)
			.expect('Content-type', /json/)
			.expect(/err/);
	});


});



describe('Test verify endpoint', () => {


	test('Requires authentication', () => {
		return request(app)
			.get('/api/verify')
			.expect(400);
	});

	test('Correct code for incorrect id tokens', () => {
		return request(app)
			.get('/api/verify?id_token=0')
			.expect(400);
	});
});


describe('Test Routing', () => {


	test('Home exists page', () => {
		return request(app)
			.get('/')
			.expect(200)
			.expect('Content-type', /html/);
	});

	test('Common resources exist', () => {
		return request(app)
			.get('/')
			.expect(200)
			.expect('Content-type', /html/);
	});

	test('Admin resources exist', () => {
		return request(app)
			.get('/')
			.expect(200)
			.expect('Content-type', /html/);
	});

	test('External resources exist', () => {
		return request(app)
			.get('/')
			.expect(200)
			.expect('Content-type', /html/);
	});

	test('404 error is returned', () => {
		return request(app)
			.get('/asd')
			.expect(404);
	});




});
