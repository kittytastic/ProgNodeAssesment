var tt_man;
var time_interval = 0.25;

// Build Page
$(document).ready(function(){
    console.log("Generating example JSON")
    let example_JSON = makeExampleJSON()
    
    tt_man = new tt_manager(example_JSON);

    buildTimeHTML();
    buildExampleBar();


    //$('#col-picker-ets').farbtastic('#colour-ets');
    
    
});

function buildTimeHTML(){
    
    console.log("Displaying TT")
   $("#tt-full").html(generateFullTT(tt_man.JSON))

    
}

function buildExampleBar(){
    console.log("Displaying editing bar")
    $("#editor_here").html(generateEditingMenu(tt_man.JSON));
}

var editor_lock = false;

// Event listeners
function deleteTimeSlot(day, index, object){
    console.log("Deleting time slot day: "+day+"  Index:"+index)
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

function editTimeSlot(day, index){
    console.log("Editing time slot day: "+day+"  Index:"+index)

    // Session select
    //$('#edit-ts-dd-here').html('<select class="ui search dropdown" id="edit-ts-ses"></select>');
      
    $('#edit-ts-dd-here').html('<div class="ui search selection dropdown"  id="edit-ts-ses"><input type="hidden" name="edit-ts-session"> <div class="text"></div><i class="dropdown icon"></i><div class="menu"> </div></div>');
    let search_dat = []
    let sessions = tt_man.tt_data.session_type;
    let day_obj = tt_man.tt_data.days[day];

   
    for(let i=0; i<sessions.length; i++){
        if(day_obj[index].session == i){
            search_dat.push({value: ""+i+"", name:sessions[i].title, selected: true});
            console.log("Setting defualt to "+sessions[i].title)
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
    setEditTSColPreview(day_obj[index].session)

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
    console.log("Changing col for "+s_id+ " to "+tt_man.tt_data.session_type[s_id].col);
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
    console.log("Setting end time with args: "+end_dom_id+", "+end_id+", "+cur_val+"")
    
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

function newTimeSlot(day){
    console.log("adding new time slot to day: "+day)
}

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
    console.log("Deleting session: "+index);
    let data = tt_man.tt_data;
    if(!editor_lock){
        // Lock editor
        editor_lock = true;
        
        

        // Remove all timeslots from GUI 
        for(let i = 0; i<data.days.length; i++){
            for(let j = 0 ; j< data.days[i].length; j++){
                if(data.days[i][j].session==index){
                    console.log("Removing day: "+i+" ts: "+j+" SID: "+data.days[i][j].session)
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

function newSession(){
    console.log("Adding session")
}

function editSession(index){
    console.log("Editing session:"+index)
}