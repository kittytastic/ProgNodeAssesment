// From infofeed.js
/* global info_sent_feedback, addInfo, negativeM, info_error_sent_feedback */

// From buildTT
/* global generateFullTT, tt_page_width_changed */

let global_tt_id =  false;
let global_u_id = false;

$( document ).ready(function() {
	
	$(window).resize(() => {
		tt_page_width_changed();
	});
	getTTList(function (content) {
		$('.ui.search').search({
			source: content,
			onSelect: function(a){getTT(a.u_id, a.tt_id);}
		});
	});
   
	$('#send_feedback').click(function () {openFeedbackForm();});
   
	// Get url arg and check if a time table id has been provided. If not show user welcome message.
	var urlParams = new URLSearchParams(window.location.search);
	if(urlParams.has('tt_id')&&urlParams.has('u_id')){
		getTT(urlParams.get('u_id'), urlParams.get('tt_id'));
	}

   
});

function openFeedbackForm(){
   
	$('#error-comment-empty').hide();
	$('#feedback-modal')
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
	if(comment_in == ''){
		$('#comment-f').addClass('error');
		$('#comment').keyup(function(){
            
			if($('#comment').val()==''){
				$('#comment-f').addClass('error');
			}else{
				$('#error-comment-empty').hide();
				$('#comment-f').removeClass('error');
                
			}
		});
		$('#error-comment-empty').show();
		return false;
	}

	let safer_com = escapeHtml(comment_in);
	title_in = escapeHtml(title_in);
	let com_obj = {
		title: title_in,
		comment: safer_com,
                
	};

   
	// Send comment off to server
	fetch('/api/feedback?tt_id='+global_tt_id+'&u_id='+global_u_id, {method:'post', body:JSON.stringify(com_obj), headers: { 'Content-Type': 'application/json'}})
		.then(status)
		.then(json)
		.then(function() {
			//console.log('Success: POST feedback');
			info_sent_feedback();
		}).catch(function() {
			//console.log('Failed: POST feedback');
			info_error_sent_feedback();
		});


}

function getTT(u_id, tt_id){
   
	fetch('/api/tt?u_id='+u_id+'&tt_id='+tt_id)
		.then(status)
		.then(json)
		.then(function(data) {
			//console.log('Success: GET timetable; tt_id: '+tt_id+' u_id: '+u_id, data);

			if(!data.err){
				global_u_id = u_id;
				global_tt_id = tt_id;
				$('#send_feedback').show();
				displayTT(JSON.stringify(data));
			}else{
				addInfo(negativeM('Error lost connection', 'Can\'t get timetable, please try again later'));
			}

        
		}).catch(function() {
			//console.log('Failed: GET timetable; tt_id: '+tt_id+' u_id: '+u_id);

			addInfo(negativeM('Error', 'Can\'t find timetable'));
        
		});

    
}

function getTTList(success_callback){

	fetch('/api/tt')
		.then(status)
		.then(json)
		.then(function(data) {
			//console.log('Success: GET List all tt', data);
			success_callback(data);

        
		}).catch(function() {
			//console.log('Failed: GET List all tt');
			addInfo(negativeM('Error', 'Can\'t load timetable search results'));
			
        
		});
    
}

function displayTT(json){
	$('#send_feedback').show();
	$('#welcome_message').hide();
   
	let table_html = generateFullTT(json);
	document.getElementById('tt-full').innerHTML = table_html;

	let key = generateKey(json);
	document.getElementById('key-holder').innerHTML = key;

	tt_page_width_changed();

} 

function generateKey(json){
	let tt_obj = JSON.parse(json);
	let outHTML = '<h3> Key </h3><table><tbody>';
	for(let i=0; i<tt_obj.session_type.length; i++){
		outHTML += '<tr><td>'+tt_obj.session_type[i].title+'</td><td>'+colourBox(tt_obj.session_type[i].col)+'</td></tr>';
	}
	outHTML += '</tbody></table>';
	return outHTML;
}

function colourBox(colourHex){
	return '<div class="colour-show" style="background-color: '+colourHex+'"></div>';
}


function escapeHtml(unsafe) {
	return unsafe
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
}


// Server functions
function status(response) {
	if (response.status >= 200 && response.status < 300) {
		return Promise.resolve(response);
	} else {
		return Promise.reject(new Error(response.statusText));
	}
}
  
function json(response) {
	return response.json();
}