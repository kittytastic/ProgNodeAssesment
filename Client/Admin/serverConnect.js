function saveTT(obj){
    console.log("Saving timetable to server")

    // Send comment off to server
    fetch('/api/tt?tt_id='+global_tt_id+'&u_id='+global_u_id, {method:'post', body:JSON.stringify(obj), headers: { "Content-Type": "application/json"}})
    .then(status)
    .then(json)
    .then(function(data) {
        console.log('Success: POST timetable', data);
        
    }).catch(function(error) {
        console.log('Failed: POST timetable', error);

        // TODO error feed lost connection
        
    });

}

function pullTT(tt_id, u_id, success_cb, fail_cb){
    
    fetch('/api/tt?tt_id=1&u_id=1')
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
  console.log(u_id)
  fetch('/api/tt?u_id='+u_id)
  .then(status)
  .then(json)
  .then(function(data) {
      console.log('Succes: GET list user tts; tt_id: '+tt_id+' u_id: '+u_id, data);
     
      if(success_cb){
          success_cb();
      }
  }).catch(function(error) {
      console.log('Failed: GET list user tts; tt_id: '+tt_id+' u_id: '+u_id, error);
      // TODO error handeler
      
      
  });
}






function status(response) {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(new Error(response.statusText))
    }
  }
  
  function json(response) {
    return response.json()
  }