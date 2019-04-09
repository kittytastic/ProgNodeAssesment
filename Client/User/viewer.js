$( document ).ready(function() {
    console.log( "ready!" );

   
    getTTList(function (content) {
        console.log("Setting up search")
        $('.ui.search').search({
            source: content,
            onSelect: function(a){getTT(a.s_id)}
          })
    })
   
   $("#send_feedback").click(function () {openFeedbackForm()});
     
    // Get url arg and check if a time table id has been provided. If not show user welcome message.
    var urlParams = new URLSearchParams(window.location.search);
    if(urlParams.has('tt_id')){
        console.log("Getting tt from server");

        
       
        getTT(urlParams.get('tt_id'));
    }else{
        $("#send_feedback").hide();
    }

});

function openFeedbackForm(){
    console.log("opening modal");
    $('#error-comment-empty').hide();
    $("#feedback-modal")
    .modal({onApprove : function() {
        return saveFeedback();
      }})
    .modal('show');
}

function saveFeedback(){
    console.log("Saving feedback")

    let comment_in = $('#comment').val();
    let title_in = $('#title').val();

    $('#comment-f').removeClass('error');

    // check for empty comment
    if(comment_in == ""){
        $('#comment-f').addClass('error');
        $('#comment').keyup(function(){
            console.log("Changed!!!");
            if($('#comment').val()==""){
                $('#comment-f').addClass('error');
            }else{
                $('#error-comment-empty').hide();
                $('#comment-f').removeClass('error');
                
            }
        })
        $('#error-comment-empty').show();
        return false;
    }

    let safer_com = escapeHtml(comment_in);
    let today = new Date();
    let com_obj = {
                title: title_in,
                comment: safer_com,
                time: today.toJSON()
    }

    // Send comment off to server

    console.log(com_obj);
}

function getTT(tt_id){
    console.log("Generating example JSON")
    let example_JSON = makeExampleJSON()

    displayTT(example_JSON);
}

function getTTList(success_callback){
    console.log("Setting up search 1")
    var content = [
        { title: 'Andorra', s_id: 3 },
        { title: 'United Arab Emirates' },
        { title: 'Afghanistan' },
        { title: 'Antigua' },
        { title: 'Anguilla' },
        { title: 'Albania' },
        { title: 'Armenia' },
        { title: 'Netherlands Antilles' },
        { title: 'Angola' },
        { title: 'Argentina' },
        { title: 'American Samoa' },
        { title: 'Austria' },
        { title: 'Australia' },
        { title: 'Aruba' },
        { title: 'Aland Islands' },
        { title: 'Azerbaijan' },
        { title: 'Bosnia' },
        { title: 'Barbados' },
        { title: 'Bangladesh' },
        { title: 'Belgium' },
        { title: 'Burkina Faso' },
        { title: 'Bulgaria' },
        { title: 'Bahrain' },
        { title: 'Burundi' }
        // etc
      ];
    success_callback(content);

}

function displayTT(json){
    $("#send_feedback").show();
    $("#welcome_message").hide();
    console.log("Rendering example JSON into HTML")
    let table_html = generateFullTT(json)

    console.log("Displaying HTML")
    document.getElementById("tt-full").innerHTML = table_html

} 

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }