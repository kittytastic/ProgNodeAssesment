// From admin.js
/* global global_tt_id, global_u_id:writeable */

// From editEvents.js
/* global buildTimeHTML, buildExampleBar */

// From infofeed.js
/* global info_error_load, info_error_comm_delete, addInfo, positiveM, negativeM */ 

// From TTOBJ.js
/* global tt_manager */

// From feedback.js
/* global  comment_obj:writable*/

/* exported saveTT, pullTT, serverGetUserTT, serverAddTT, serverDeleteFeedback, serverGetFeedback, mostRecentError, comment_obj, serverVerify */

var tt_man;

let mostRecentError;
let session_token;

/* ******************************************
   *                Timetable               *
   ****************************************** */

function saveTT(obj, success_cb, fail_cb){
	//console.log('Saving timetable to server');

	// Send comment off to server
	fetch('/api/tt?tt_id='+global_tt_id+'&u_id='+global_u_id+'&auth='+session_token, {method:'post', body:JSON.stringify(obj), headers: { 'Content-Type': 'application/json'}})
		.then(status)
		.then(json)
		.then(function() {
			//console.log('Success: POST timetable');
			addInfo(positiveM('Success', 'Timetable saved.'));
			if(success_cb){
				success_cb();
			}
        
		}).catch(function(error) {
			//console.log('Failed: POST timetable', error);
			mostRecentError = error;
			addInfo(negativeM('Error lost connection', 'Can\'t save timetable, please try again later'));
			if(fail_cb){
				fail_cb();
			}
        
		});

}

function pullTT(tt_id, u_id, success_cb, fail_cb){
    
	fetch('/api/tt?tt_id='+tt_id+'&u_id='+u_id)
		.then(status)
		.then(json)
		.then(function(data) {
			//console.log('Succes: GET timetable; tt_id: '+tt_id+' u_id: '+u_id, data);
			tt_man = new tt_manager();
			tt_man.tt_data = data;
			buildTimeHTML();
			buildExampleBar();
			if(success_cb){
				success_cb();
			}
		}).catch(function(error) {
			//console.log('Failed: GET timetable; tt_id: '+tt_id+' u_id: '+u_id, error);
			mostRecentError = error;
			info_error_load();
			if(fail_cb){
				fail_cb();
			}
		});
    
}

function serverGetUserTT(u_id, success_cb){
 
	fetch('/api/tt?u_id='+u_id)
		.then(status)
		.then(json)
		.then(function(data) {
			//console.log('Succes: GET list user tts; tt_id: null u_id: '+u_id, data);
     
			if(success_cb){
				success_cb(data);
			}
		}).catch(function(error) {
			mostRecentError = error;
			//console.log('Failed: GET list user tts; tt_id: null u_id: '+u_id, error);
			// Ommited error message as getting a users timetables is always preceded by
			// 1. Changing timetable
			// 2. Sigining in
			// Both of which have thier own connection errors 
      
		});
}



function serverAddTT(n, sd, d, success_cb){
	// Send comment off to server
	fetch('/api/tt?new=yes&u_id='+global_u_id+'&auth='+session_token, {method:'post', body:JSON.stringify({name: n, start_day: sd, dur: d}), headers: { 'Content-Type': 'application/json'}})
		.then(status)
		.then(json)
		.then(function(data) {
			//console.log('Success: POST new timetable', data);
			// TODO got bad response from server
			if(success_cb){
				success_cb(data);
			}
        
		}).catch(function(error) {
			mostRecentError = error;
			//console.log('Failed: POST new timetable', error);
			addInfo(negativeM('Error lost connection', 'Can\'t add timetable "'+n+'", please try again later'));
			// TODO error feed lost connection
        
		});

}

/* ******************************************
   *             Authentication             *
   ****************************************** */

function serverVerify(id_token, success_cb){
 
	fetch('/api/verify?id_token='+id_token)
		.then(status)
		.then(json)
		.then(function(data) {
			//console.log('Succes: GET verify; token: to long to show ', data);
			global_u_id = parseInt(data.u_id);
			session_token = data.auth_token;

			if(success_cb){
				success_cb(data);
			}
		}).catch(function(error) {
			mostRecentError = error;
			//console.log('Failed: GET verify; token: to long to show', error);
			
			addInfo(negativeM('Error lost connection', 'We couldn\'t verify you identity with our server.'));
      
		});
}


/* ******************************************
   *                Feedback                *
   ****************************************** */

function serverDeleteFeedback(c_id, success_callback){
	//console.log('Server delete func:'+c_id);
	fetch('/api/feedback?tt_id='+global_tt_id+'&u_id='+global_u_id+'&c_id='+c_id+'&auth='+auth_token, {method:'delete'})
		.then(status)
		.then(json)
		.then(function(data) {
			//console.log('Success: deleting comment; u_id: '+global_u_id+' tt_id: '+global_tt_id+' c_id: '+c_id, data);
			if(!data.err){
				success_callback();
			}
		}).catch(function(error) {
			mostRecentError = error;
			//console.log('Failed: deleting comment; u_id: '+global_u_id+' tt_id: '+global_tt_id+' c_id: '+c_id, error);
			info_error_comm_delete();
        
		});

}

function serverGetFeedback(tt_id, u_id, success_cb, fail_cb){

	fetch('/api/feedback?tt_id='+tt_id+'&u_id='+u_id+'&c_id=all')
		.then(status)
		.then(json)
		.then(function(data) {
			//console.log('Success: GET list feedback; u_id: '+u_id+' tt_id: '+tt_id+' c_id=all', data);
			comment_obj = data;
			if(success_cb){
				success_cb();
			}
		}).catch(function(error) {
			mostRecentError = error;
			//console.log('Failed: Get list feedback; u_id: '+u_id+' tt_id: '+tt_id+' c_id=all', error);
    
			if(fail_cb){
				fail_cb();
			}
		});

}

/* ******************************************
   *                General Purpose                *
   ****************************************** */


function status(response) {
	if (response.status >= 200 && response.status < 300) {
		return Promise.resolve(response);
	} else {
		return Promise.reject(new Error(response.statusText));
	}
}
  
function json(response) {
	return response.json();
}