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
    console.log("Deleting session: "+index)
}

function newSession(){
    console.log("Adding session")
}

function editSession(index){
    console.log("Editing session:"+index)
}