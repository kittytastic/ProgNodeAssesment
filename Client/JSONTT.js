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

    tt_data.days[0].push(new time_slot(6,22, 1))
    tt_data.days[2].push(new time_slot(5.5,13.25, 1))
    tt_data.days[2].push(new time_slot(13.25,22, 0))

    tt_data.days[4].push(new time_slot(6.5,21, 0))
    tt_data.days[3].push(new time_slot(14,18,1))
    tt_data.days[1].push(new time_slot(7,6, 1))

    tt_data.session_type = [new session_type("#2ECC40", "Nothing", 1, 0), new session_type("#F012BE", "General", 1, 0)]
    
    return JSON.stringify(tt_data)
}


function validateJSON(){
// times between 24 hr
// Slot finishes after it starts

// Days 0-6
// No repeat ID's


}