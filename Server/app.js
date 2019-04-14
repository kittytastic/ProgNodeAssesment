/* eslint-env node */

const express = require('express');
const app = express();


const db = require('./mock_db');


db.start();


//var bodyParser = require('body-parser')
//app.use( bodyParser.json() );       // to support JSON-encoded bodies
//app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
// extended: true
//})); 

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

	// No user id, list all timetables
	if(!u_id){
		//console.log('GET LIST request for timetables ' + tt_id + " u_id: "+u_id);
		res.send(db.list_timetable_names());
		return;
	}

	// User ID but no timetable ID, list all timetables for that user
	if(!tt_id){
		let result = db.list_timetable_names(u_id);
		if(!result){
			//console.log('[FAILED] GET request for timetables for user: '+u_id);
			res.status(400);
			res.send({err: 'no tt_id argument given'});
			return;
		}

		//console.log('GET LIST request for timetables for user: '+u_id);
		res.send(result);
		return;

	}

	// Send tt_data
	let results = db.load_tt(tt_id, u_id);
	if(results){
		//console.log('GET request for timetable; tt_id: ' + tt_id + " u_id: "+u_id);
		res.send(results);
		return;
	}else{
		//console.log('[FAILED] GET request for timetable; tt_id: ' + tt_id + " u_id: "+u_id);
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

	if(!u_id){
		//console.log('[FAILED] POST timetable; u_id: '+u_id+' tt_id: ' +tt_id+' new:'+new_q );
		res.send(db.list_timetable_names());
		return;
	}

	if(new_q=='yes'){
		// Add new TT
		let meta_name = tt_data.name;
		let meta_day = tt_data.start_day;
		let meta_dur = tt_data.dur;

		if(!meta_day || !meta_day || !meta_dur){
			res.status(400);
			res.send({err: 'add timetable data didn\'t contain required fields'});
			return;
		}

		let result = db.add_tt(u_id, meta_name, meta_day, meta_dur);
		if(result){
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

		// Edit exsisting TT
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
	//console.log('GET request to feedback API; u_id:'+u_id+' tt_id: '+tt_id+' c_id:'+c_id)
	// Check if the correct arguments have been supplied
	if(!tt_id){
		//console.log('[FAILED] GET request to feedback API; u_id:'+u_id+' tt_id: '+tt_id+' c_id:'+c_id)
		res.status(400);
		res.send({err: 'no tt_id argument given'});
		return;
	}

	if(!u_id){
		//console.log('[FAILED] GET request to feedback API; u_id:'+u_id+' tt_id: '+tt_id+' c_id:'+c_id)
		res.status(400);
		res.send({err: 'no u_id argument given'});
		return;
	}

	if(!c_id){
		//console.log('[FAILED] GET request to feedback API; u_id:'+u_id+' tt_id: '+tt_id+' c_id:'+c_id)
		res.status(400);
		res.send({err: 'no c_id argument given'});
		return;
	}

	if(c_id=='all'){
		let results = db.load_all_comments(tt_id, u_id);
		if(!results){
			//console.log('[FAILED] GET request to feedback API; u_id:'+u_id+' tt_id: '+tt_id+' c_id:'+c_id)
			res.status(400);
			res.send({err: 'Arguments out of range'});
			return;
		}
		res.send(results);
		return;
	} else {
		let results = db.load_comment(tt_id, u_id, c_id);
		if(!results){
			//console.log('[FAILED] GET request to feedback API; u_id:'+u_id+' tt_id: '+tt_id+' c_id:'+c_id)
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
	if(!tt_id){
		//console.log('[FAILED] POST request to comment API; tt_id:'+tt_id +' u_id:'+u_id);  
		res.status(400);
		res.send({err: 'no tt_id argument given'});
		return;
	}

	if(!u_id){
		//console.log('[FAILED] POST request to comment API; tt_id:'+tt_id +' u_id:'+u_id); 
		res.status(400);
		res.send({err: 'no u_id argument given'});
		return;
	}
	let today = new Date();

    
	db.add_comment(tt_id, u_id, req.body.title, req.body.comment, today.toJSON());
	res.send({success:''});
    
});

/* ---------- DELETE ----------- */
app.delete('/api/feedback', function (req, res) {
  
	let tt_id = req.query.tt_id;
	let u_id = req.query.u_id;
	let c_id = req.query.c_id;

	//console.log('DELETE request to feedback API; u_id:'+u_id+' tt_id: '+tt_id+' c_id:'+c_id)
	// Check if the correct arguments have been supplied
	if(!tt_id){
		//console.log('[FAILED] DELETE request to feedback API; u_id:'+u_id+' tt_id: '+tt_id+' c_id:'+c_id)
		res.status(400);
		res.send({err: 'no tt_id argument given'});
		return;
	}

	if(!u_id){
		//console.log('[FAILED] DELETE request to feedback API; u_id:'+u_id+' tt_id: '+tt_id+' c_id:'+c_id)
		res.status(400);
		res.send({err: 'no u_id argument given'});
		return;
	}

	if(!c_id){
		//console.log('[FAILED] DELETE request to feedback API; u_id:'+u_id+' tt_id: '+tt_id+' c_id:'+c_id)
		res.status(400);
		res.send({err: 'no c_id argument given'});
		return;
	}

	if(db.delete_comment(tt_id, u_id, c_id)){
		res.send({success: ''});  
	}else{
		//console.log('[FAILED] DELETE request to feedback API; u_id:'+u_id+' tt_id: '+tt_id+' c_id:'+c_id)
		res.status(400);
		res.send({err: 'couldnt find comment to delete'});
	}

});


/* ************************
   *         404          *
   ************************ */
app.use(function (req, res) {
	res.status(404).send('Sorry can\'t find that!');
});


module.exports = app;
