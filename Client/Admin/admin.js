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
    unsavedChanges = false;
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
        nagigateAway(function(){drawPage(parseInt(value), global_u_id);  })
        
    }
}

function addTT(){
$('#add-tt-form')
.form({
  fields: {
    name: {
        identifier  : 'name',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please enter a name'
          }
        ]
    },
    day: {
        identifier  : 'day',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please choice a starting day'
          }
        ]
    },
    dur: {
      identifier  : 'dur',
      rules: [
        {
          type   : 'integer[1..14]',
          prompt : 'Please enter a number between 1 and 14 for the duration'
        }
      ]

    }
  }
});
    $('#pick-day').dropdown();
    $("#add-tt").modal({
        onApprove : function(){
          //$('#add-tt-form').submit(); 
          //console.log($('#add-tt-form').form('validate form'))
          //$('#add-tt-form').form('submit')
          if($('#add-tt-form').form('validate form')){
            let n = $('#add-tt-name').val();
            let sd = $('#pick-day').dropdown('get value')
            let d = $('#add-tt-dur').val();

            sd= parseInt(sd)
            d = parseInt(d)
           
            serverAddTT(n, sd, d, function(data){
              drawPage(data.tt_id, global_u_id);
            })
          } 
          else{
            return false;
          }}

    }).modal('show');
    
}

var unsavedChanges = true;

function nagigateAway(yes_cb){
    if(unsavedChanges){
      // Check if you are sure you want ot navigate away
      $('#change-tt').modal({
        onApprove : function() {
            yes_cb();
        }
      }).modal('show');
    }else{
      return true;
    }
}

function setUnsavedChanges(state){
  unsavedChanges = state
  if(state){
    window.onbeforeunload = function() {return true;};
  }else {
    window.onbeforeunload = null;
  }
}