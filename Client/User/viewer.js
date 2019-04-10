$( document ).ready(function() {
    console.log( "ready!" );

   
    getTTList(function (content) {
        console.log("Setting up search")
        $('.ui.search').search({
            source: content,
            onSelect: function(a){getTT(a.u_id, a.tt_id)}
          })
    })
   
   $("#send_feedback").click(function () {openFeedbackForm()});
     
    // Get url arg and check if a time table id has been provided. If not show user welcome message.
    var urlParams = new URLSearchParams(window.location.search);
    if(urlParams.has('tt_id')&&urlParams.has('u_id')){
        console.log("Getting tt from server");

        
       
        getTT(urlParams.get('u_id'), urlParams.get('tt_id'));
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

    console.log(JSON.stringify(com_obj))
    // Send comment off to server
    
    fetch('/api/feedback?tt_id=1&u_id=1', {method:'post', body:JSON.stringify(com_obj), headers: { "Content-Type": "application/json"}})
    .then(status)
    .then(json)
    .then(function(data) {
        console.log('Succeeded with JSON response', data);
        
    }).catch(function(error) {
        console.log('Request failed', error);

        // TODO error feed lost connection
        
    });


    console.log(com_obj);
}

function getTT(u_id, tt_id){
   
    fetch('/api/tt?u_id='+u_id+'&tt_id='+tt_id)
    .then(status)
    .then(json)
    .then(function(data) {
        console.log('Succeeded with JSON response', data);
        if(!data.err){
            displayTT(JSON.stringify(data));
        }else{
            // TODO timetable doesnt exist
        };

        
    }).catch(function(error) {
        console.log('Request failed', error);

        // TODO error feed lost connection
        
    });

    
}

function getTTList(success_callback){
    console.log("Setting up search 1")

    fetch('/api/tt')
    .then(status)
    .then(json)
    .then(function(data) {
        console.log('Succeeded with JSON response', data);
        success_callback(data);

        
    }).catch(function(error) {
        console.log('Request failed', error);

        // TODO error feed lost connection
        
    });
    
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