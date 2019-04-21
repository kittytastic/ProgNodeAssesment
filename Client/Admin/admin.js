/* global initiateAjaxButtons, initFeedback, serverGetUserTT, serverAddTT, pullTT */
// serverConnect.js
/* global serverVerify */

// Google API
/* global gapi */
/* exported signOut, onSignIn */
var global_u_id = 1;
var global_tt_id = 1;
var unsavedChanges = false;

function onSignIn(googleUser) {
	
	

	var id_token = googleUser.getAuthResponse().id_token;
	
	serverVerify(id_token, function(){
		setPageState(1);
	});

	
}

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

// Shows/hides elements with classes .init_show and .init_hide 
/*function showHide(show){
	if(show){
		$('.init_show').hide();
		$('.init_hidden').show();
	}else{
		$('.init_hidden').hide();
		$('.init_show').show();
	}

}*/

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
		addTT();
	}else{
		nagigateAway(function(){drawPage(parseInt(value), global_u_id);  });
        
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
							prompt : 'Please enter a name'
						},
						{
							type   : 'maxLength[20]',
							prompt : 'Name cannot be more than {ruleValue} characters long'
						}
					]
				},
				day: {
					identifier  : 'day',
					rules: [
						{
							type   : 'empty',
							prompt : 'Please choice a starting day'
						}
					]
				},
				dur: {
					identifier  : 'dur',
					rules: [
						{
							type   : 'integer[1..14]',
							prompt : 'Please enter a number between 1 and 14 for the duration'
						}
					]

				}
			}
		});
	$('#pick-day').dropdown();
	$('#add-tt').modal({
		onApprove : function(){
			//$('#add-tt-form').submit(); 
			//console.log($('#add-tt-form').form('validate form'))
			//$('#add-tt-form').form('submit')
			if($('#add-tt-form').form('validate form')){
				let n = $('#add-tt-name').val();
				let sd = $('#pick-day').dropdown('get value');
				let d = $('#add-tt-dur').val();

				n = escapeHtml(n);
				sd= parseInt(sd);
				d = parseInt(d);
           
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
function nagigateAway(yes_cb){
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
	$('#get_share').on('click', function() {
		$('#share-modal').modal('show');}
	);
 
}


function escapeHtml(unsafe) {
	return unsafe
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
}