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

function buildTimeHTML(){
   $("#tt-full").html(generateFullTT(tt_man.JSON))

    
}

function buildExampleBar(){
    $("#editor_here").html(generateEditingMenu(tt_man.JSON));
}

function initiateAjaxButtons(){
    $("#save_but").on('click', function(){ 
        saveButLoad(true);
        saveTT();
    })

    $("#undo_but").on('click', function(){ 
        $('#undo-all-modal').modal({
            onApprove : function() {
                undoButLoad(true);
                pullTT(tt_id, u_id, function () {undoButLoad(false)}, function () {undoButLoad(false)});
            }
          }).modal('show');
    })

}

function saveButLoad(state){
    if(state){
        // Set button to load state
        $("#save_but").addClass("loading");
        $("#save_but i").hide();
    }else{
        // Set button to normal state
        $("#save_but").removeClass("loading");
        $("#save_but i").show();
    }
}

function undoButLoad(state){
    if(state){
        // Set button to load state
        $("#undo_but").addClass("loading");
    }else{
        // Set button to normal state
        $("#undo_but").removeClass("loading");
    }
}

var editor_lock = false;

/* -------------------------------------------------------
   |                    Delete TS                        |
   ------------------------------------------------------- */

// Event listeners
function deleteTimeSlot(day, index, object){
    if(!editor_lock){
        editor_lock = true;
        tt_man.remove_time_slot(day,index);
        buildTimeHTML()
        $(object).parent().hide(200, function() {
            buildExampleBar();
            editor_lock = false;
        });
    }
}

/* -----------------------------------------------------
   |                    Edit TS                        |
   ----------------------------------------------------- */
function editTimeSlot(day, index){
    // Session select
    $('#edit-ts-dd-here').html('<div class="ui search selection dropdown"  id="edit-ts-ses"><input type="hidden" name="edit-ts-session"> <div class="text"></div><i class="dropdown icon"></i><div class="menu"> </div></div>');
    let search_dat = []
    let sessions = tt_man.tt_data.session_type;
    let day_obj = tt_man.tt_data.days[day];

    for(let i=0; i<sessions.length; i++){
        if(day_obj[index].session == i){
            search_dat.push({value: ""+i+"", name:sessions[i].title, selected: true});
            
        }else{
            search_dat.push({value: ""+i+"", name:sessions[i].title});
        }
    }

    // Ready modal components
    $('#edit-ts-ses').dropdown({values: search_dat})
    $('#edit-ts-ses').dropdown('setting', 'onChange', 
    function(new_val){setEditTSColPreview(parseInt(new_val))});

    makeTimeDD("edit-ts-st-dd-here", "edit-ts-start", day_obj[index].start, 'edit-ts-et-dd-here', 'edit-ts-end', day_obj[index].end);
    $("#edit-ts-error").hide();
    setEditTSColPreview(day_obj[index].session);

    // Show modal
    $('#edit-ts')
    .modal({
        onApprove : function() {
          return editTSSave(day, index)
        }
      })
      .modal('show');
}

function setEditTSColPreview(s_id){
   
    $("#edit-ts-col-pre").css("background-color", tt_man.tt_data.session_type[s_id].col);
}

function editTSSave(day, index){
    // Get new values
    let new_start = $('#edit-ts-start').dropdown('get value');
    let new_end = $('#edit-ts-end').dropdown('get value');
    let new_session = $('#edit-ts-ses').dropdown('get value');

    // Make sure they are all numbers
    new_start = parseFloat(new_start);
    new_end = parseFloat(new_end);
    new_session = parseFloat(new_session);

    // Check if the new times overlap with existing times
    if(tt_man.can_edit_ts(day, index, new_start, new_end)){
        // Update session info
        tt_man.tt_data.days[day][index].session = new_session;
        tt_man.tt_data.days[day][index].start = new_start;
        tt_man.tt_data.days[day][index].end = new_end;
    }else{
        // Display error
        $("#edit-ts-error").show();

        // Block modal closing
        return false;
    }

    buildExampleBar();
    buildTimeHTML();
}

function makeTimeDD(start_dom_id, start_id, start_t, end_dom_id, end_id, end_t){
    
    // Create and populate start time dropdown
    $('#'+start_dom_id).html('<div class="ui search selection dropdown"  id="'+start_id+'"><input type="hidden" name="edit-ts-session"> <div class="text"></div><i class="dropdown icon"></i><div class="menu"> </div></div>');
    let search_dat = genSearchTimeObj(0, start_t);
    $('#'+start_id).dropdown({values: search_dat});


    // Update endtime DD everytime start time changes
    $('#'+start_id)
    .dropdown('setting', 'onChange', 
    function(new_val) {createEndTimeDD(end_dom_id, end_id, $('#'+end_id).dropdown('get value'), new_val)}
    );
    
    // Create and populate end time dropdown
    createEndTimeDD(end_dom_id, end_id, end_t, start_t);

}

function createEndTimeDD(end_dom_id, end_id, cur_val, start_t){
    
    // parse to make sure they are integers
    cur_val = parseFloat(cur_val);
    start_t = parseFloat(start_t);

    // If there is a new start time past curent val
    let set_to = cur_val;
    if(set_to <= start_t){
        set_to = start_t+time_interval;
    }

    // Create end time DD and populate with values
    $('#'+end_dom_id).html('<div class="ui search selection dropdown"  id="'+end_id+'"><input type="hidden" name="edit-ts-session"> <div class="text"></div><i class="dropdown icon"></i><div class="menu"> </div></div>');
    let search_dat = genSearchTimeObj(start_t, set_to);
    $('#'+end_id).dropdown({values: search_dat});
}

function genSearchTimeObj(start_t, selected){
    let start_min_i = (start_t- Math.floor(start_t))/time_interval
    let search_dat = [];
    for(let i = Math.floor(start_t); i<24; i++){
        for(let j = 0; j<(1/time_interval); j++){
            if(i>Math.floor(start_t)||j>start_min_i){
                let time_d = i + j*time_interval;
                let time_hhmm = timeFormat(time_d);
                if(time_d == selected){
                    search_dat.push({value: '' + time_d, name:time_hhmm, selected:true});
                }
                else{search_dat.push({value: '' + time_d, name:time_hhmm});}
            }
        }
    }
    return search_dat;

}

/* -----------------------------------------------------
   |                     Add TS                        |
   ----------------------------------------------------- */

function newTimeSlot(day){

    $('#add-ts-dd-here').html('<div class="ui search selection dropdown"  id="add-ts-ses"><input type="hidden" name="add-ts-session"> <div class="text"></div><i class="dropdown icon"></i><div class="menu"> </div></div>');
    let search_dat = []
    let sessions = tt_man.tt_data.session_type;
    let day_obj = tt_man.tt_data.days[day];

    for(let i=0; i<sessions.length; i++){
            search_dat.push({value: ""+i+"", name:sessions[i].title});
    }

    // Ready modal components
    $('#add-ts-ses').dropdown({values: search_dat})
    $('#add-ts-ses').dropdown('setting', 'onChange', 
    function(new_val){setAddTSColPreview(parseInt(new_val))});

    makeTimeDD("add-ts-st-dd-here", "add-ts-start", time_interval, 'add-ts-et-dd-here', 'add-ts-end', 24 - time_interval);
    $("#add-ts-error-overlap").hide();
    $("#add-ts-error-ses").hide();
    
    // TODO change to a default colour stored in the meta
    $("#add-ts-col-pre").css("background-color", defualt_col)

    // Show modal
    $('#add-ts')
    .modal({
        onApprove : function() {
          return addTSSave(day);
        }
      })
      .modal('show');


}

function setAddTSColPreview(s_id){
   
    $("#add-ts-col-pre").css("background-color", tt_man.tt_data.session_type[s_id].col);
}

function addTSSave(day){
     // Get new values
     let new_start = $('#add-ts-start').dropdown('get value');
     let new_end = $('#add-ts-end').dropdown('get value');
     let new_session = $('#add-ts-ses').dropdown('get value');
 
     

     // Make sure they are all numbers
     new_start = parseFloat(new_start);
     new_end = parseFloat(new_end);
     new_session = parseFloat(new_session);

     if(isNaN(new_session)){
         // Error a session hasnt been selected
         $("#add-ts-error-ses").show();

         $("#add-ts-ses").addClass("error");
         $("#add-ts-ses").dropdown('setting', 'onChange', 
         function(new_val) {$("#add-ts-ses").removeClass("error"); setAddTSColPreview(parseInt(new_val)); $("#add-ts-error-ses").hide();}
         );

         return false;
     }
 
    

     if(!tt_man.add_time_slot(new_start, new_end, new_session, day)){
        $("#add-ts-error-overlap").show();
        return false;
    }

    buildExampleBar();
    buildTimeHTML();

}

/* -----------------------------------------------------
   |                  Delete Session                   |
   ----------------------------------------------------- */
function deleteSession(index){
    
    $('#delete-modal')
    .modal({
      onApprove : function() {
        deleteSessionAndChildren(index)
      }
    })
    .modal('show')
    ;
}

function deleteSessionAndChildren(index){
    
    let data = tt_man.tt_data;
    if(!editor_lock){
        // Lock editor
        editor_lock = true;
        
        // Remove all timeslots from GUI 
        for(let i = 0; i<data.days.length; i++){
            for(let j = 0 ; j< data.days[i].length; j++){
                if(data.days[i][j].session==index){
                    $("#edit-ts-"+i+"-"+j).hide(200)
                }
            }
        }

        // Update tt data object
        tt_man.remove_session_force(index);

        // Remove session from GUI
        $("#edit-s-"+index).hide(200, function (){
            // After session has been removed from GUI rebuild editing bar and unlock 
            buildExampleBar();
            editor_lock = false;
        });

        // Build TT whilst editing bar items are fading
        buildTimeHTML()

    }
}

/* -----------------------------------------------------
   |                    Add Session                    |
   ----------------------------------------------------- */

function newSession(){

    $.farbtastic('#add-col-picker').setColor(defualt_col);

    $('#add-ses-error-empty').hide()
    $('#add-ses-error-sym').hide()
    $('#add-ses-error-col').hide()
    
    $("#add-ses").modal({
        onApprove : function() {
          return addSessionSave();
        }
      }).modal('show');
}

function addSessionSave(){
    let new_col = $('#add-colour').val();
    let new_name = $('#add-ses-name').val();

    $('#add-ses-name-f').removeClass('error');

    // check for empty name
    if(new_name == ""){
        $('#add-ses-name-f').addClass('error');
        $('#add-ses-name').keyup(function(){
           
            if($('#add-ses-name').val()==""){
                $('#add-ses-name-f').addClass('error');
            }else{
                $('#add-ses-error-empty').hide();
                $('#add-ses-name-f').removeClass('error');
                
            }
        })
        $('#add-ses-error-empty').show();
        return false;
    }

    if(hasSymbols(new_name)){
        $('#add-ses-error-sym').show();
        $('#add-ses-name-f').addClass('error');
        return false;
    }

    if(!isHexCol(new_col)){
        $('#add-ses-error-col').show();
        return false;
    }

    tt_man.add_session(new_col, new_name);

    buildExampleBar();
    buildTimeHTML();
}


/* -----------------------------------------------------
   |                   Edit Session                    |
   ----------------------------------------------------- */
function editSession(index){
    
    $('#edit-ses-name').val(tt_man.tt_data.session_type[index].title);
    $.farbtastic('#edit-col-picker').setColor(tt_man.tt_data.session_type[index].col);
    
    $('#edit-ses-error-empty').hide()
    $('#edit-ses-error-sym').hide()
    $('#edit-ses-error-col').hide()
    
    $("#edit-ses").modal({
        onApprove : function() {
          return editSessionSave(index);
        }
      }).modal('show');
}

function editSessionSave(index){
    let new_col = $('#edit-colour').val();
    let new_name = $('#edit-ses-name').val();


    $('#edit-ses-name-f').removeClass('error');

    // check for empty name
    if(new_name == ""){
        $('#edit-ses-name-f').addClass('error');
        $('#edit-ses-name').keyup(function(){
            
            if($('#edit-ses-name').val()==""){
                $('#edit-ses-name-f').addClass('error');
            }else{
                $('#edit-ses-error-empty').hide();
                $('#edit-ses-name-f').removeClass('error');
                
            }
        })
        $('#edit-ses-error-empty').show();
        return false;
    }

    if(hasSymbols(new_name)){
        $('#edit-ses-error-sym').show();
        $('#edit-ses-name-f').addClass('error');
        return false;
    }

    if(!isHexCol(new_col)){
        $('#edit-ses-error-col').show();
        return false;
    }

    tt_man.tt_data.session_type[index].title = new_name;
    tt_man.tt_data.session_type[index].col = new_col;

    buildExampleBar();
    buildTimeHTML();
}


function hasSymbols(string){
    var format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    return format.test(string)
}

function isHexCol(string){
    let format = /^(#)([0-9A-F]{6})$/i;
    return format.test(string)
}

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