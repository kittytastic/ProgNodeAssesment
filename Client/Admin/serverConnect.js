var tt_man;

function saveTT(obj, success_cb){
	console.log('Saving timetable to server');

	// Send comment off to server
	fetch('/api/tt?tt_id='+global_tt_id+'&u_id='+global_u_id, {method:'post', body:JSON.stringify(obj), headers: { 'Content-Type': 'application/json'}})
		.then(status)
		.then(json)
		.then(function(data) {
			console.log('Success: POST timetable', data);
			if(success_cb){
				success_cb();
			}
        
		}).catch(function(error) {
			console.log('Failed: POST timetable', error);

			// TODO error feed lost connection
        
		});

}

function pullTT(tt_id, u_id, success_cb, fail_cb){
    
	fetch('/api/tt?tt_id='+tt_id+'&u_id='+u_id)
		.then(status)
		.then(json)
		.then(function(data) {
			console.log('Succes: GET timetable; tt_id: '+tt_id+' u_id: '+u_id, data);
			tt_man = new tt_manager();
			tt_man.tt_data = data;
			buildTimeHTML();
			buildExampleBar();
			if(success_cb){
				success_cb();
			}
		}).catch(function(error) {
			console.log('Failed: GET timetable; tt_id: '+tt_id+' u_id: '+u_id, error);
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
			console.log('Succes: GET list user tts; tt_id: null u_id: '+u_id, data);
     
			if(success_cb){
				success_cb(data);
			}
		}).catch(function(error) {
			console.log('Failed: GET list user tts; tt_id: null u_id: '+u_id, error);
			// TODO error handeler
      
      
		});
}









function serverAddTT(n, sd, d, success_cb){
	// Send comment off to server
	fetch('/api/tt?new=yes&u_id='+global_u_id, {method:'post', body:JSON.stringify({name: n, start_day: sd, dur: d}), headers: { 'Content-Type': 'application/json'}})
		.then(status)
		.then(json)
		.then(function(data) {
			console.log('Success: POST new timetable', data);
			// TODO got bad response from server
			if(success_cb){
				success_cb(data);
			}
        
		}).catch(function(error) {
			console.log('Failed: POST new timetable', error);

			// TODO error feed lost connection
        
		});

}


/* ******************************************
   *                Feedback                *
   ****************************************** */

function serverDeleteFeedback(c_id, success_callback){
  
	fetch('/api/feedback?tt_id='+global_u_id+'&u_id='+global_tt_id+'&c_id='+c_id, {method:'delete'})
		.then(status)
		.then(json)
		.then(function(data) {
			console.log('Success: deleting comment; u_id: '+global_u_id+' tt_id: '+global_tt_id+' c_id: '+c_id, data);
			success_callback();
		}).catch(function(error) {
			console.log('Failed: deleting comment; u_id: '+global_u_id+' tt_id: '+global_tt_id+' c_id: '+c_id, error);
			info_error_comm_delete();
        
		});

}

function serverGetFeedback(tt_id, u_id, success_cb, fail_cb){

	fetch('/api/feedback?tt_id='+tt_id+'&u_id='+u_id+'&c_id=all')
		.then(status)
		.then(json)
		.then(function(data) {
			console.log('Success: GET list feedback; u_id: '+u_id+' tt_id: '+tt_id+' c_id=all', data);
			comment_obj = data;
			if(success_cb){
				success_cb();
			}
		}).catch(function(error) {
			console.log('Failed: Get list feedback; u_id: '+u_id+' tt_id: '+tt_id+' c_id=all', error);
    
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