class session_type  {
    constructor(id, col, title, status) {
    this.id = id;
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

class tt {
    constructor(){
        this.days  = [];
        this.session_types = [];
        this.meta = new tt_meta(0)
    }
}

function makeExampleJSON(){
    var tt_data = new tt();
    
    for(i =0 ;i<5; i++) tt_data.days.push([]);

    tt_data.days[0].push(new time_slot(22,6, 1))
    tt_data.days[1].push(new time_slot(6,22, 1))
    tt_data.days[2].push(new time_slot(6.5,21, 1))
    tt_data.days[3]
    tt_data.days[4].push(new time_slot(5,18.25, 1))

    tt_data.session_type = [new session_type(0, "Nothing", 2, 0), new session_type(1, "General", 2, 0)]
    
    return JSON.stringify(tt_data)
}


function validateJSON(){
// times between 24 hr
// Slot finishes after it starts

// Days 0-6
// No repeat ID's


}