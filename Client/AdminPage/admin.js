var tt_man;


// Build Page
$(document).ready(function(){
    console.log("Generating example JSON")
    let example_JSON = makeExampleJSON()
    
    tt_man = new tt_manager(example_JSON);

    buildPageHTML();



    
});

function buildPageHTML(){
    
    console.log("Displaying TT")
   $("#tt-full").html(generateFullTT(tt_man.JSON))

    console.log("Displaying editing bar")
    $("#editor_here").html(generateEditingMenu(tt_man.JSON));

    $('.ui.accordion').accordion();
}

// Event listeners
function deleteTimeSlot(day, index){
    console.log("Deleting time slot day: "+day+"  Index:"+index)
    tt_man.remove_time_slot(day,index);
    buildPageHTML();
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