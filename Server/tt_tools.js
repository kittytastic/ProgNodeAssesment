/* eslint-env node */

class session_type  {
	constructor(col, title, status) {
		this.col = col;
		this.title = title;
		this.status = status;
	}
}

class time_slot  {
	constructor(start, end, session) {
		this.start = start;
		this.end = end;
		this.session = session;
	}
}

class tt_meta  {
	constructor(start_day, name) {
		this.start_day = start_day;
		this.name = name;
	}
}


class tt_data {
	constructor(){
		this.days  = [];
		this.session_type = [];
		this.meta = new tt_meta(0);
	}
}



/******** Checks of an [tt_obj] arg is valid *********/
function validate(obj){
    
    
	if(is_undefined(obj.days)){
		//console.log('TT obj is not valid missing: tt.days');
		return false;
	}

	if(is_undefined(obj.session_type)){
		//console.log('TT obj is not valid missing: tt.session_type');
		return false;
	}
    
	if(is_undefined(obj.meta)){
		//console.log('TT obj is not valid missing: tt.meta');
		return false;
	}

	/* Check all sub classes have the required fields???? */

	/* ------- Check all days ------- */
	let n_days = obj.days.length;
	let greatest_s_type = obj.session_type.length-1;

	for(let i = 0; i < n_days; i++){
		let n_t_slots = obj.days[i].length;
		for(let j = 0; j<n_t_slots; j++){
			if(!is_logically_valid_time_slot(obj.days[i][j])){
				//console.log('TT obj is not valid day['+i+']['+j+'] time slot isn\'t logically valid');
				return false;
			}

			if(obj.days[i][j].session > greatest_s_type || obj.days[i][j].session < 0){
				//console.log('TT obj is not valid day['+i+']['+j+'] times slot doesn\'t point to an existing session');
				return false;
			}

		}
	}

	return true;
}

/******** Checks if a timeslot ends after it starts and in in a 24hr day *********/
function is_logically_valid_time_slot(ts){
	let duration = ts.end - ts.start;
	if(duration<=0){
		return false;
	}

	if(ts.start<0){
		return false;
	}

	if(ts.end>24){
		return false;
	}

	return true;

}

/******** Check if arg is undefined *********/
function is_undefined(x){
	return (typeof x === 'undefined');
}

function new_tt(name, start_day, dur){
	var tt_dat = new tt_data();
    
	for(let i =0 ;i<dur; i++) tt_dat.days.push([]);
	tt_dat.meta = new tt_meta(start_day, name);

	return tt_dat;
}


function makeExampleObj(){
	var tt_dat = new tt_data();
    
	for(let i =0 ;i<5; i++) tt_dat.days.push([]);

	tt_dat.days[0].push(new time_slot(5.5,22.5, 1));

	//tt_dat.days[1].push(new time_slot(7,6, 3)) // ERROR SESSION
	tt_dat.days[1].push(new time_slot(9,13, 3));
	tt_dat.days[1].push(new time_slot(17.,19.5, 2));

	tt_dat.days[2].push(new time_slot(6,13.25, 1));
	tt_dat.days[2].push(new time_slot(13.25,22, 0));

    
	tt_dat.days[3].push(new time_slot(14,18,2));
    
	tt_dat.days[4].push(new time_slot(6.5,21, 3));

	tt_dat.session_type = [new session_type('#E4572E', 'Boring', 1), 
		new session_type('#17BEBB', 'General', 1),
		new session_type('#FFC914', 'Public', 1),
		new session_type('#76B041', 'Normal', 1),
		new session_type('#76B041', 'Really Long Session Name', 1)];
    
	tt_dat.meta = new tt_meta(0, 'Swim TT');

	return tt_dat;
}

module.exports = {
	mock_tt: function () {
		return makeExampleObj();
	},
	validate: function(obj){
		return validate(obj);
	},
	new_tt: function(n,s,d){
		return new_tt(n,s,d);
	}
};