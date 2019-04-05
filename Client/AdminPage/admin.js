var tt_man;


// Build Page
$(document).ready(function(){
    console.log("Generating example JSON")
    let example_JSON = makeExampleJSON()
    
    tt_man = new tt_manager(example_JSON);

    buildTimeHTML();
    buildExampleBar();


    //$('.visible.example .ui.sidebar').sidebar();
    
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