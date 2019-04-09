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
    constructor(start_day) {
    this.start_day = start_day;
  }
}

class day {
    constructor(){
        this.activities = []
    }
}

class tt_data {
    constructor(){
        this.days  = [];
        this.session_type = [];
        this.meta = new tt_meta(0)
    }
}

class tt_manager{
    constructor(optional_json){
        
        this.tt_data = null; 
        if (typeof optional_json !== 'undefined') { 
            this.digest_JSON(optional_json);
        }
    }

    /******** Checks of an [tt_obj] arg is valid *********/
    validate(obj){
        
        
        if(this._is_undefined(obj.days)){
            console.log("TT obj is not valid missing: tt.days")
            return false;
        }

        if(this._is_undefined(obj.session_type)){
            console.log("TT obj is not valid missing: tt.session_type")
            return false;
        }
        
        if(this._is_undefined(obj.meta)){
            console.log("TT obj is not valid missing: tt.meta")
            return false;
        }

        /* Check all sub classes have the required fields???? */

        /* ------- Check all days ------- */
        let n_days = obj.days.length;
        let greatest_s_type = obj.session_type.length-1;

        for(let i = 0; i < n_days; i++){
            let n_t_slots = obj.days[i].length
            for(let j = 0; j<n_t_slots; j++){
                if(!this._is_logically_valid_time_slot(obj.days[i][j])){
                    console.log("TT obj is not valid day["+i+"]["+j+"] time slot isn't logically valid")
                    return false;
                }

                if(obj.days[i][j].session > greatest_s_type || obj.days[i][j].session < 0){
                    console.log("TT obj is not valid day["+i+"]["+j+"] times slot doesn't point to an existing session")
                    return false;
                }

            }
        }

        return true;
    }

    /******** Checks if a timeslot ends after it starts and in in a 24hr day *********/
    _is_logically_valid_time_slot(ts){
        let duration = ts.end - ts.start
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
    _is_undefined(x){
        return (typeof x === 'undefined')
    }

    /******** Check time slot and then adds it *********/
    add_time_slot(start, end, session_id, to_day){
        let temp_ts = new time_slot(start, end, session_id);
        if(!this._is_logically_valid_time_slot(temp_ts)){
            return false;
        }

        if(temp_ts.session >= this.tt_data.session_type.length || temp_ts.session < 0){
            return false;
        }

        if(to_day>=this.tt_data.days.length){
            return false;
        }


        for(let i = 0; i < this.tt_data.days[to_day].length; i ++){
            if(start >= this.tt_data.days[to_day][i].start && start < this.tt_data.days[to_day][i].end){
                return false;
            }

            if(end > this.tt_data.days[to_day][i].start && end <=
                this.tt_data.days[to_day][i].end){
                return false;
            }
        }


        this.tt_data.days[to_day].push(temp_ts)
        return true
    }

    can_edit_ts(day, index, new_start, new_end){
        
        for(let i = 0; i < this.tt_data.days[day].length; i ++){
            // Dont check against its old self
            if(i!= index){
                if(new_start > this.tt_data.days[day][i].start && new_start < this.tt_data.days[day][i].end){
                    return false;
                }

                if(new_end > this.tt_data.days[day][i].start && new_end < this.tt_data.days[day][i].end){
                    return false;
                }
            }
        }

        return true;
    }

    /******** checks then remoes timeslot *********/
    remove_time_slot(day, index){
        if(day>=this.tt_data.days.length){
            return false;
        }

        if(index>=this.tt_data.days[day].length){
            return false;
        }

        this.tt_data.days[day].splice(index, 1)
        return true;
    }

    /******** Add session *********/
    add_session(col, name){
        this.tt_data.session_type.push(new session_type(col, name, 0))
    }

    /******** removes session, fails if it is in use *********/
    remove_session(id){
        if(id >= this.tt_data.session_type.length || id<0){
            return false;
        }

        let n_days = this.tt_data.days.length;
        for(let i = 0; i < n_days; i++){
            let n_t_slots = this.tt_data.days[i].length
            for(let j = 0; j<n_t_slots; j++){
                if (this.tt_data.days[i][j].session==id){
                    return false;
                }

            }
        }

        this._delete_session_refactor(id);

        return true;
    }

    /******** Removes session, deletes all time slots referencing it *********/
    remove_session_force(id){
        if(id >= this.tt_data.session_type.length || id<0){
            return false;
        }

        let n_days = this.tt_data.days.length;
        for(let i = 0; i < n_days; i++){
            let n_t_slots = this.tt_data.days[i].length
            for(let j = n_t_slots-1; j>=0; j--){
                if (this.tt_data.days[i][j].session==id){
                    this.remove_time_slot(i,j)
                }

            }
        }

        this._delete_session_refactor(id);

        return true;
    }

    /******** Removes session, changes all timeslots referencing it to a  new session *********/
    remove_session_change(id, new_session){
        if(id >= this.tt_data.session_type.length || id < 0){
            return false;
        }

        if(new_session >= this.tt_data.session_type.length || new_session < 0){
            return false;
        }

        let n_days = this.tt_data.days.length;
        for(let i = 0; i < n_days; i++){
            let n_t_slots = this.tt_data.days[i].length
            for(let j = n_t_slots-1; j>=0; j--){
                if (this.tt_data.days[i][j].session==id){
                    this.tt_data.days[i][j].session= new_session
                }

            }
        }

        this._delete_session_refactor(id);

        return true;
    }

    /******** Deletes session and refactors the list *********/
    _delete_session_refactor(id){
        this.tt_data.session_type.splice(id, 1)

        let n_days = this.tt_data.days.length;
        for(let i = 0; i < n_days; i++){
            let n_t_slots = this.tt_data.days[i].length
            for(let j = 0; j<n_t_slots; j++){
                if (this.tt_data.days[i][j].session>id){
                    this.tt_data.days[i][j].session -= 1;
                }

            }
        }
    }

    /******** changes json to obj if the json is a valid obj *********/
    digest_JSON(tt_json){
        
        if(this.tt_data != null){
            console.log("Error digesting JSON. TT Object already exists are you sure you want to overwrite?")
            return;
        }

        let temp_obj = JSON.parse(tt_json);

        if(!this.validate(temp_obj)){
            console.log("Error digesting JSON. JSON given wasn't a valid TT object.")
            return;
        }
        
        this.tt_data = temp_obj;
    }

    get JSON(){
        return JSON.stringify(this.tt_data);
    }

}

function makeExampleJSON(){
    var tt_dat = new tt_data();
    
    for(i =0 ;i<5; i++) tt_dat.days.push([]);

    tt_dat.days[0].push(new time_slot(5.5,22.5, 1))

    //tt_dat.days[1].push(new time_slot(7,6, 3)) // ERROR SESSION
    tt_dat.days[1].push(new time_slot(9,13, 3))
    tt_dat.days[1].push(new time_slot(17.,19.5, 2))

    tt_dat.days[2].push(new time_slot(6,13.25, 1))
    tt_dat.days[2].push(new time_slot(13.25,22, 0))

    
    tt_dat.days[3].push(new time_slot(14,18,2))
    
    tt_dat.days[4].push(new time_slot(6.5,21, 3))

    tt_dat.session_type = [new session_type("#E4572E", "Boring", 1), 
                            new session_type("#17BEBB", "General", 1),
                            new session_type("#FFC914", "Public", 1),
                            new session_type("#76B041", "Normal", 1),
                            new session_type("#76B041", "Really Long Session Name", 1)]
    
    tt_dat.meta = new tt_meta(0);

    return JSON.stringify(tt_dat)
}