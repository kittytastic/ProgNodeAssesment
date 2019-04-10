var tt_man;
var time_interval = 0.25;
var defualt_col = "#2E282A"

var u_id = 1
var tt_id = 1
var global_u_id = 1
var global_tt_id = 1
// Build Page
$(document).ready(function(){


    pullTT();

    // Set up colour pickers in the session popups
    $('#edit-col-picker').farbtastic('#edit-colour');
    $('#add-col-picker').farbtastic('#add-colour');

    //initiateInfoFeed();
    initiateAjaxButtons();
    initFeedback();
    initiateMyTTDD();
    
    
});



function initiateMyTTDD(){
   /* serverGetUserTT(u_id, function(server_data){
        let dd_data = []
        for(let i=0; i<server_data.length; i++){
            dd_data.push({name: server_data[i].title, value:server_data[i].u_id +"-"+server_data[i].tt_id})
        }
        $("my_tt").dropdown({values: dd_data});
    })*/
}

function changeTT(){}

function addTT(){}