function saveTT(json){
    console.log("Saving timetable to server")

}

function pullTT(tt_id, u_id, success_cb, fail_cb){
    console.log("Pulling timetable form server")
    
    fetch('/api/tt?tt_id=1&u_id=1')
    .then(status)
    .then(json)
    .then(function(data) {
        console.log('Request succeeded with JSON response', data);
        tt_man = new tt_manager();
        tt_man.tt_data = data;
        buildTimeHTML();
        buildExampleBar();
        if(success_cb){
            success_cb();
        }
    }).catch(function(error) {
        console.log('Request failed', error);
        info_error_load();
        if(fail_cb){
            fail_cb();
        }
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