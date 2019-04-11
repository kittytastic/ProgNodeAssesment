var tt_man;
var time_interval = 0.25;
var defualt_col = "#2E282A"

//var u_id = 1
//var tt_id = 1
var global_u_id = 1
var global_tt_id = 1
// Build Page
$(document).ready(function(){


    

    // Set up colour pickers in the session popups
    $('#edit-col-picker').farbtastic('#edit-colour');
    $('#add-col-picker').farbtastic('#add-colour');

    //initiateInfoFeed();
    initiateAjaxButtons();
   drawPage(0,1)
    
    
});

function drawPage(tt_id, u_id){
    global_tt_id = tt_id
    global_u_id = u_id
    pullTT(global_tt_id, global_u_id);
    initFeedback();
    initiateMyTTDD();
}


function initiateMyTTDD(){
    serverGetUserTT(global_u_id, function(server_data){
        let dd_data = []
       
        for(let i=0; i<server_data.length; i++){
            
                dd_data.push({name: server_data[i].title, value:""+server_data[i].tt_id})
            
        }
        dd_data.push({name: "Add new", value: "new"})
       
        $("#my_tt").dropdown({values: dd_data});
        $("#my_tt").dropdown('setting', 'onChange',function(value){
            changeTT(value)

        })
    })
}

function changeTT(value){
    
    if(value=="new"){
        addTT();
    }else{
        
        drawPage(parseInt(value), global_u_id);
    }
}

function addTT(){

}