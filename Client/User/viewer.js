let global_tt_id =  false;
let global_u_id = false;

$( document ).ready(function() {
   
    getTTList(function (content) {
        $('.ui.search').search({
            source: content,
            onSelect: function(a){getTT(a.u_id, a.tt_id)}
          })
    })
   
   $("#send_feedback").click(function () {openFeedbackForm()});
     
    // Get url arg and check if a time table id has been provided. If not show user welcome message.
    var urlParams = new URLSearchParams(window.location.search);
    if(urlParams.has('tt_id')&&urlParams.has('u_id')){
        getTT(urlParams.get('u_id'), urlParams.get('tt_id'));
    }else{
        $("#send_feedback").hide();
    }

   
});

function openFeedbackForm(){
   
    $('#error-comment-empty').hide();
    $("#feedback-modal")
    .modal({onApprove : function() {
        return saveFeedback();
      }})
    .modal('show');
}

function saveFeedback(){

    let comment_in = $('#comment').val();
    let title_in = $('#title').val();

    $('#comment-f').removeClass('error');

    // check for empty comment
    if(comment_in == ""){
        $('#comment-f').addClass('error');
        $('#comment').keyup(function(){
            
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
    fetch('/api/feedback?tt_id='+global_tt_id+'&u_id='+global_u_id, {method:'post', body:JSON.stringify(com_obj), headers: { "Content-Type": "application/json"}})
    .then(status)
    .then(json)
    .then(function(data) {
        console.log('Success: POST feedback', data);
        
    }).catch(function(error) {
        console.log('Failed: POST feedback', error);

        // TODO error feed lost connection
        
    });


}

function getTT(u_id, tt_id){
   
    fetch('/api/tt?u_id='+u_id+'&tt_id='+tt_id)
    .then(status)
    .then(json)
    .then(function(data) {
        console.log('Success: GET timetable; tt_id: '+tt_id+' u_id: '+u_id, data);

        if(!data.err){
            global_u_id = u_id;
            global_tt_id = tt_id;
            displayTT(JSON.stringify(data));
        }else{
            // TODO timetable doesnt exist
        };

        
    }).catch(function(error) {
        console.log('Failed: GET timetable; tt_id: '+tt_id+' u_id: '+u_id, error);

        // TODO error feed lost connection
        
    });

    
}

function getTTList(success_callback){

    fetch('/api/tt')
    .then(status)
    .then(json)
    .then(function(data) {
        console.log('Success: GET List all tt', data);
        success_callback(data);

        
    }).catch(function(error) {
        console.log('Failed: GET List all tt', error);

        // TODO error feed lost connection
        
    });
    
}

function displayTT(json){
    $("#send_feedback").show();
    $("#welcome_message").hide();
   
    let table_html = generateFullTT(json)
    document.getElementById("tt-full").innerHTML = table_html

    let key = generateKey(json)
    document.getElementById("key-holder").innerHTML = key

} 

function generateKey(json){
    let tt_obj = JSON.parse(json)
    let outHTML = "<h3> Key </h3><table><tbody>"
    for(let i=0; i<tt_obj.session_type.length; i++){
        outHTML += '<tr><td>'+tt_obj.session_type[i].title+'</td><td>'+colourBox(tt_obj.session_type[i].col)+'</td></tr>'
    }
    outHTML += "</tbody></table>"
    return outHTML;
}

function colourBox(colourHex){
    return '<div class="colour-show" style="background-color: '+colourHex+'"></div>'
}


function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }


// Server functions
 function status(response) {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(new Error(response.statusText))
    }
  }
  
  function json(response) {
    return response.json()
  }