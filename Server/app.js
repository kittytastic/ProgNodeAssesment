/* eslint-env node */

const express = require('express');
const app = express();


const db = require('./mock_db');
const crypto = require('./dev_only_auth');


db.start();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/', express.static('./Client/User'));
app.use('/Common', express.static('./Client/Common'));
app.use('/Admin', express.static('./Client/Admin'));
app.use('/External', express.static('./Client/ExternalDependencies'));

/* ************************************
   *               Timetables           *
   ************************************** */

/* ----------- GET ------------- */
app.get('/api/tt', function (req, res) {
	let tt_id = req.query.tt_id;
	let u_id = req.query.u_id;
	
	

	// No user id or tt_id, LIST ALL timetables
	if(u_id === undefined && tt_id === undefined){
		//console.log('GET LIST request for timetables ' + tt_id + ' u_id: '+u_id);
		res.send(db.list_timetable_names());
		return;
	}

	u_id = parseInt(u_id);
	if(!isInt(u_id) || u_id === undefined){
		res.status(400);
		res.send({err: 'u_id must be an integer'});
		return;
	}

	// User ID but no timetable ID, list all timetables for that user
	if(tt_id === undefined){
		let result = db.list_timetable_names(u_id);
		
		if(!result){
			//console.log('[FAILED] GET request for timetables for user: '+u_id);
			res.status(400);
			res.send({err: 'u_id is out of range'});
			return;
		}

		//console.log('GET LIST request for timetables for user: '+u_id);
		res.send(result);
		return;

	}


	// TT is defined send timetable data
	tt_id = parseInt(tt_id);
	if(!isInt(tt_id)){
		res.status(400);
		res.send({err: 'tt_id must be an integer'});
		return;
	}

	// Send tt_data
	let results = db.load_tt(tt_id, u_id);
	if(results){
		//console.log('GET request for timetable; tt_id: ' + tt_id + ' u_id: '+u_id);
		res.send(results);
		return;
	}else{
		//console.log('[FAILED] GET request for timetable; tt_id: ' + tt_id + ' u_id: '+u_id);
		res.status(400);
		res.send({err: 'arguments given are out of range'});
		return;
	}
});

app.post('/api/tt', function (req, res) {
    
	let u_id = req.query.u_id;
	let tt_id = req.query.tt_id;
	let new_q = req.query.new;
	let tt_data = req.body;
	let auth_token = req.query.auth;

	

	// Check if user exists
	if(u_id === undefined){
		//console.log('[FAILED] POST timetable; u_id: '+u_id+' tt_id: ' +tt_id+' new:'+new_q );
		res.status(400);
		res.send({err: 'no u_id or auth specified'});
		return;
	}

	u_id = parseInt(u_id);
	if(!isInt(u_id)){
		res.status(400);
		res.send({err: 'u_id must be an integer'});
		return;
	}

	// Verify user credentials
	if(!crypto.verify(u_id, auth_token)){
		//console.log('[FAILED AUTH] POST timetable; u_id: '+u_id+' tt_id: ' +tt_id+' new:'+new_q );
		res.status(403);
		res.send({err: 'please supply valid authentication token'});
		return;
	}

	if(new_q=='yes'){
		// Add new TT
		let meta_name = tt_data.name;
		let meta_day = tt_data.start_day;
		let meta_dur = tt_data.dur;

		// Check the required feilds have been supplied
		if(!meta_name || meta_day===undefined || !meta_dur){
			res.status(400);
			res.send({err: 'add timetable data didn\'t contain required fields'});
			return;
		}

		// Add the tt to the database
		let result = db.add_tt(u_id, meta_name, meta_day, meta_dur);
		
		// Check the results of the addition
		if(result != 'fail'){
			//console.log('POST ADD timetable; u_id: '+u_id+' tt_id: ' +tt_id+' new:'+new_q );
			res.send({success:'', tt_id: result});
			return;
		}else{
			//console.log('[FAILED] POST ADD timetable; u_id: '+u_id+' tt_id: ' +tt_id+' new:'+new_q );
			res.status(400);
			res.send({err: 'timetable data or u_id wasnt vaild'});
			return;
		}
		
	}else{
		//Edit a TT

		// Check tt_id is provided
		if(tt_id===undefined){
			res.status(400);
			res.send({err: 'u_id must be an integer'});
			return;
		}

		// Check tt_id is an int
		tt_id = parseInt(tt_id);
		if(!isInt(tt_id)){
			res.status(400);
			res.send({err: 'tt_id must be an integer'});
			return;
		}


		// Send to database and check response
		let result = db.edit_tt(u_id, tt_id, tt_data);
		if(result){
			//console.log('POST timetable; u_id: '+u_id+' tt_id: ' +tt_id+' new:'+new_q );
			res.send({success:''});
			return;
		}else{
			//console.log('[FAILED] POST timetable; u_id: '+u_id+' tt_id: ' +tt_id+' new:'+new_q );
			res.status(400);
			res.send({err: 'timetable data or u_id/tt_id wasn\'t vaild'});
			return;
		}

	}
    
});


/* ************************************
   *           Feedback Comments        *
   ************************************** */
/* ----------- GET ------------- */
 
app.get('/api/feedback', function (req, res) {
    
	let tt_id = req.query.tt_id;
	let u_id = req.query.u_id;
	let c_id = req.query.c_id;
	//console.log('GET request to feedback API; u_id:'+u_id+' tt_id: '+tt_id+' c_id:'+c_id);
	// Check if the correct arguments have been supplied
	if(!tt_id){
		//console.log('[FAILED] GET request to feedback API; u_id:'+u_id+' tt_id: '+tt_id+' c_id:'+c_id);
		res.status(400);
		res.send({err: 'no tt_id argument given'});
		return;
	}

	tt_id = parseInt(tt_id);
	if(!isInt(tt_id)){
		res.status(400);
		res.send({err: 'tt_id must be an integer'});
		return;
	}

	if(u_id==undefined){
		//console.log('[FAILED] GET request to feedback API; u_id:'+u_id+' tt_id: '+tt_id+' c_id:'+c_id);
		res.status(400);
		res.send({err: 'no u_id argument given'});
		return;
	}

	u_id = parseInt(u_id);
	if(!isInt(u_id)){
		res.status(400);
		res.send({err: 'u_id must be an integer'});
		return;
	}

	if(c_id==undefined){
		//console.log('[FAILED] GET request to feedback API; u_id:'+u_id+' tt_id: '+tt_id+' c_id:'+c_id);
		res.status(400);
		res.send({err: 'no c_id argument given'});
		return;
	}

	if(c_id=='all'){
		let results = db.load_all_comments(tt_id, u_id);
		if(!results){
			//console.log('[FAILED] GET request to feedback API; u_id:'+u_id+' tt_id: '+tt_id+' c_id:'+c_id);
			res.status(400);
			res.send({err: 'Arguments out of range'});
			return;
		}
		res.send(results);
		return;
	} else {

		c_id = parseInt(c_id);
		if(!isInt(c_id)){
			res.status(400);
			res.send({err: 'cc_id must be an integer or value: all'});
			return;
		}

		let results = db.load_comment(tt_id, u_id, c_id);
		if(!results){
			//console.log('[FAILED] GET request to feedback API; u_id:'+u_id+' tt_id: '+tt_id+' c_id:'+c_id);
			res.status(400);
			res.send({err: 'Arguments out of range'});
			return;
		}
		res.send(results);
	}
    
});

/* ----------- POST ------------ */
app.post('/api/feedback', function (req, res) {
	let tt_id = req.query.tt_id;
	let u_id = req.query.u_id;
	//console.log('POST request to comment API; tt_id:'+tt_id +' u_id:'+u_id); 

	// Check if the correct arguments have been supplied
	tt_id = parseInt(tt_id);
	if(tt_id === undefined || !isInt(tt_id)){
		//console.log('[FAILED] POST request to comment API; tt_id:'+tt_id +' u_id:'+u_id);  
		res.status(400);
		res.send({err: 'tt_id must be supplied and must be an integer'});
		
		return;
	}

	u_id = parseInt(u_id);
	if(u_id === undefined || !isInt(u_id)){
		//console.log('[FAILED] POST request to comment API; tt_id:'+tt_id +' u_id:'+u_id); 
		res.status(400);
		res.send({err: ' u_id argument must be supplied and must be an integer'});
		return;
	}
	let today = new Date();

    
	if(db.add_comment(tt_id, u_id, req.body.title, req.body.comment, today.toJSON())){
		res.send({success:''});
	}else{
		res.status(400);
		res.send({err: ' failed to add comment, tt_id or u_id must not exist'});
		return;
	}
    
});

/* ---------- DELETE ----------- */
app.delete('/api/feedback', function (req, res) {
  
	let tt_id = req.query.tt_id;
	let u_id = req.query.u_id;
	let c_id = req.query.c_id;
	let auth_token = req.query.auth;

	
	// Check if the correct arguments have been supplied
	tt_id = parseInt(tt_id);
	if(tt_id === undefined || !isInt(tt_id)){
		//console.log('[FAILED] DELETE request to feedback API; u_id:'+u_id+' tt_id: '+tt_id+' c_id:'+c_id);
		res.status(400);
		res.send({err: 'tt_id must be supplied and must be an integer'});
		return;
	}

	u_id = parseInt(u_id);
	if(u_id === undefined || !isInt(u_id)){
		//console.log('[FAILED] DELETE request to feedback API; u_id:'+u_id+' tt_id: '+tt_id+' c_id:'+c_id);
		res.status(400);
		res.send({err: 'u_id argument must be supplied and must be an integer'});
		return;
	}

	c_id = parseInt(c_id);
	if(c_id === undefined || !isInt(c_id)){
		//console.log('[FAILED] DELETE request to feedback API; u_id:'+u_id+' tt_id: '+tt_id+' c_id:'+c_id);
		res.status(400);
		res.send({err: 'c_id argument must be supplied and must be an integer'});
		return;
	}

	// Verify user credentials
	if(!crypto.verify(u_id, auth_token)){
		//console.log('[FAILED AUTH] POST timetable; u_id: '+u_id+' tt_id: ' +tt_id+' new:'+new_q );
		res.status(403);
		res.send({err: 'please supply valid authentication token'});
		return;
	}

	if(db.delete_comment(tt_id, u_id, c_id)){
		//console.log('DELETE request to feedback API; u_id:'+u_id+' tt_id: '+tt_id+' c_id:'+c_id);
		res.send({success: ''});  
	}else{
		//console.log('[FAILED] DELETE request to feedback API; u_id:'+u_id+' tt_id: '+tt_id+' c_id:'+c_id);
		res.status(400);
		res.send({err: 'couldnt find comment to delete'});
	}

});

/* *************************
   *		Verify			*
	************************* */

app.get('/api/verify', function (req, res) {
	let id_token = req.query.id_token;

	//console.log('GET request to verify; token: too long to show');
	// Check if the correct arguments have been supplied
	if(!id_token){
		res.status(400);
		res.send({err: 'no id_token argument given'});
		return;
	}

	crypto.first_verify(id_token, function(uid, at){db.check_and_fix_user_exist(uid); res.send({u_id: uid, auth_token: at});}, function(){//console.log('fail Verify'); res.status(400);
		res.send({err: 'couldnt verify'});});

	
	
});


/* ************************
   *         404          *
   ************************ */
app.use(function (req, res) {
	res.status(404).send('Sorry can\'t find that!');
});


function isInt(x){
	return Number.isInteger(x);
}

module.exports = app;



