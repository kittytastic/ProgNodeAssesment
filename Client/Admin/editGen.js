/* exported generateEditingMenu */
function generateEditingMenu(json){
    
	var tt_obj = JSON.parse(json);
    
	let day_names = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday','Sunday'];
    
	let outHTML = '<div>';
	
	// Edit sessions menu
	outHTML += '<h2 style="text-align: center">Edit Sessions</h2>';
	outHTML += generateEditingSessions(tt_obj.session_type);

	outHTML += '<hr/>';
	
	// Edit time slots menu
	outHTML+='<h2 style="text-align: center">Edit session times</h2>';

	if(tt_obj.session_type.length>0){
		// Add all editing days
		for(let i = 0; i < tt_obj.days.length; i++){
			outHTML += generateEditingDay(tt_obj.days[i], day_names[(tt_obj.meta.start_day + i )%7], tt_obj.session_type, i);
		}
	}else{
		outHTML += '<p style = "text-align:center; margin: 1em; padding-bottom: 2em;"> To specify when a session is on you must first add a session in the menu above!</p>';
	}

	
	outHTML += '</div>';
	return outHTML;
}

function generateEditingDay(day_obj, day_name, sessions, day_id){
	let outHTML = '<h3>'+day_name+'</h3>';
	outHTML += '<div class="editing-day-content"><table><tbody>';
         
   
    
	for(let i =0 ; i< day_obj.length; i++){
		outHTML += '<tr id="edit-ts-'+day_id+'-'+i+'">';
		outHTML += '<td>'+timeFormat(day_obj[i].start)+' - '+timeFormat(day_obj[i].end)+'</td><td>'+sessions[day_obj[i].session].title+'</td>';
		outHTML += '<td>'+colourBox(sessions[day_obj[i].session].col)+'</td>';
		// Icon and event listener for edit time slot
		outHTML += '<td onclick = "editTimeSlot('+day_id+','+i+')"><i class="edit icon"></i></td>';
		// Icon and event listener for delete time slot
		outHTML += '<td onclick = "deleteTimeSlot('+day_id+','+i+', this)"><i class="trash icon"></i></td>';
		outHTML += '</tr>';
	}
	// Icon and event listener for add time slot
	outHTML += '<tr  onclick = "newTimeSlot('+day_id+')" class="clickable"><th colspan=2>Add new activity on '+ day_name +'</th><td><i class="plus icon add-icon"></i></td></tr>';
	outHTML += '</tbody></table></div>';
	return outHTML;
}

function generateEditingSessions(sesh_obj){
	let outHTML = '<table><tbody>';
	for(let i=0; i<sesh_obj.length; i++){
		outHTML += '<tr id="edit-s-'+i+'"><td>'+sesh_obj[i].title+'</td><td>'+colourBox(sesh_obj[i].col)+'</td>';
		outHTML += '<td onclick="editSession('+i+')"><i class="edit icon"></i></td>';
		outHTML += '<td onclick="deleteSession('+i+', this)"><i class="trash icon"></i></td></tr>';
        
	}
	outHTML += '<tr onclick="newSession()" class="clickable"><th>Add new session</th><td><i class="plus icon"></i></td></tr>';
	outHTML += '</tbody></table>';

	return outHTML;
}

function colourBox(colourHex){
	return '<div class="colour-show" style="background-color: '+colourHex+'"></div>';
}

function timeFormat(time){
	let min = time-Math.floor(time);

	if(min==0){
		min = '00';
	}else{
		min = 60 * min;
	}

	let format = ''+Math.floor(time)+':'+min;
	return format;
}