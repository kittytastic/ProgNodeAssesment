/* global initiateAjaxButtons, initFeedback, serverGetUserTT, serverAddTT, pullTT */

// serverConnect.js
/* global serverVerify */

// BuildTT.js
/* global tt_labels_max:writable, tt_labels_min:writable, tt_page_width_changed */
/* exported tt_labels_max, tt_labels_min */

// Google API
/* global gapi */
/* exported signOut, onSignIn */
var global_u_id = 1;
var global_tt_id = 1;
var unsavedChanges = false;

// Called by Google sign-in API
function onSignIn(googleUser) {
	var id_token = googleUser.getAuthResponse().id_token;
	serverVerify(id_token, function(){
		setPageState(1);
	});
}

// Called by Google sign-in api
function signOut() {
	setPageState(0);
	
	var auth2 = gapi.auth2.getAuthInstance();
	auth2.signOut().then(function () {
		//console.log('User signed out.');
			
	});
}

// On page ready
$(document).ready(function(){
	// Set TT label rotating parameters
	tt_labels_max = 1600;
	tt_labels_min = 1000;
	$(window).resize(() => {
		tt_page_width_changed();
	});

	// Set up colour pickers in the session popups
	$('#edit-col-picker').farbtastic('#edit-colour');
	$('#add-col-picker').farbtastic('#add-colour');

	setPageState(0);
    
	initiateAjaxButtons();
  
    
});

function setPageState(state){
	if(state == 1){
		// Show "please select"
		initiateMyTTDD();
		$('.page_state_0').hide();
		$('.page_state_2').hide();
		$('.page_state_1').show();
					
				
	}else if (state == 2){
		// show editing view
		initiateMyTTDD();
		$('.page_state_0').hide();
		$('.page_state_1').hide();
		$('.page_state_2').show();
				
				
	}else {
		// Show "please sign-in"
		clearMyTTDD();
		$('.page_state_1').hide();
		$('.page_state_2').hide();
		$('.page_state_0').show();
				
	}

}

// Draws page for user u_id and timetable tt_id
function drawPage(tt_id, u_id){
	unsavedChanges = false;
	global_tt_id = tt_id;
	global_u_id = u_id;
	setPageState(2);
	pullTT(global_tt_id, global_u_id, () => {tt_page_width_changed();});
	
	initFeedback();
	initiateMyTTDD();
	initiateGetShare();
}

/* ******************************************
   *	    My timetables dropdown			*
   ****************************************** */

// Setup the "My timetables" dropdown menu html object
function initiateMyTTDD(){
	serverGetUserTT(global_u_id, function(server_data){
		let dd_data = [];
       
		for(let i=0; i<server_data.length; i++){
            
			dd_data.push({name: server_data[i].title, value:''+server_data[i].tt_id});
            
		}
		dd_data.push({name: 'Add new', value: 'new'});
       
		$('#my_tt').dropdown({values: dd_data});
		$('#my_tt').dropdown('setting', 'onChange',function(value){
			changeTT(value);

		});
	});
}

function clearMyTTDD(){
	$('#my_tt').dropdown({values: []});
}

// Function used to change timetable
function changeTT(value){
	if(value=='new'){
		navigateAway(()=>addTT());
	}else{
		navigateAway(function(){drawPage(parseInt(value), global_u_id);  });
        
	}
}

// Adds a timetable
function addTT(){
	$('#add-tt-form')
		.form({
			fields: {
				name: {
					identifier  : 'name',
					rules: [
						{
							type   : 'empty',
							prompt : 'Please enter a name.'
						},
						{
							type   : 'maxLength[20]',
							prompt : 'Name cannot be more than {ruleValue} characters long.'
						}
					]
				},
				
				ttType: {
					identifier  : 'ttType',
					rules: [
						{
							type   : 'empty',
							prompt : 'Please choice a timetable type.'
						}
					]
				},
			
			}
		});
	
	$('#pick-tt-type').dropdown();
	$('#add-tt').modal({
		onApprove : function(){
			
			if($('#add-tt-form').form('validate form')){
				let n = $('#add-tt-name').val();
				let t = $('#pick-tt-type').dropdown('get value');

				let sd = 0;
				let d = 7; 

				if(t=='FW'){
					sd =0;
					d = 7;
				}else if(t=='WD'){
					sd = 0;
					d = 5;
				}else {
					sd = 5;
					d = 2;
				}
				
				n = escapeHtml(n);
           
				serverAddTT(n, sd, d, function(data){
					drawPage(data.tt_id, global_u_id);
				});
			} 
			else{
				return false;
			}}

	}).modal('show');
    
}


/* ******************************************
   *	             Other       			*
   ****************************************** */
// Should be called when the timetable is going to change to get user to confirm
function navigateAway(yes_cb){
	if(unsavedChanges){
		// Check if you are sure you want ot navigate away
		$('#change-tt').modal({
			onApprove : function() {
				yes_cb();
			}
		}).modal('show');
	}else{
		yes_cb();
	}
}

// Show share link
function initiateGetShare(){
	document.getElementById('share-link').value = (window.location.origin+'?u_id='+global_u_id+'&tt_id='+global_tt_id);
	
	// Share button listener
	$('#get_share').on('click', function() {
		$('#share-modal').modal('show');}
	);

	// Copy icon listener
	$('#copy_share_button').on('click', function() {
		var copyText = document.getElementById('share-link');
		copyText.select();
		document.execCommand('copy');
	});
 
}


function escapeHtml(unsafe) {
	return unsafe
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
}