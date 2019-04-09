let info_count = 0;
let max_info = 5;

let success_save = '<div class="ui positive message"><i class="close icon"></i><div class="header">Success!</div>Timetable was succesfully saved.</div>';
let error_connection = '<div class="ui negative message"><i class="close icon"></i><div class="header">Connection Lost </div>Unable to save timetable. Please try again later.</div>'
let error_connection_com = '<div class="ui negative message"><i class="close icon"></i><div class="header">Connection Lost </div>Unable to delete comment. Please try again later.</div>'
let error_connection_load = '<div class="ui negative message"><i class="close icon"></i><div class="header">Connection Lost </div>Unable to load timetable. Please try again later.</div>'

function initiateInfoFeed(){
  addCloseListeners();  

  for(let i=0; i<3; i++){
      addInfo(success_save);
  }

  for(let i=0; i<3; i++){
    addInfo(error_connection);
}

}

function addCloseListeners(){
    // Set up the message behaviour 
    $('.message .close')
    .on('click', function() {
        info_count-=1;
        $(this).closest('.message').fadeOut(200, function() {
            $(this).remove();
        });
    });
}

function addInfo(messageHTML){
    info_count +=1

    if(info_count>max_info){
        removeOldestInfo();
    }
    $('#info-feed').append(messageHTML);
    addCloseListeners();
}

function removeOldestInfo(){
    info_count -=1;
    $('#info-feed div').first().remove();

}


function info_success_save(){
    addInfo(success_save);
}

function info_error_save(){
    addInfo(error_connection);
}

function info_error_load(){
    addInfo(error_connection_load);
}

function info_error_comm_delete(){
    addInfo(error_connection_com);
}