class session_type  {
    constructor(id, col, title, status) {
    this.id = id;
    this.col = col;
    this.title = title;
    this.status = status;
  }
}

class time_slot  {
    constructor(id, start, end, relative_day) {
    this.id = id;
    this.start = start;
    this.end = end;
    this.relative_day = relative_day;
  }
}

class day_info  {
  // Mon, Tue, Wed, Thur
  // new day_info(0, 3, 0)
  // day_span = 4

  // Mon ... Sun, Mon, Tue
  // new day_info(0, 1, 1)
  // day_span = 9
    constructor(start_day, end_day, extra_weeks) {
    this.start_day = start_day;
    this.end_day = end_day;
    this.extra_weeks = extra_weeks;
    this.day_span = end_day-start_day + (7 * (extra_weeks))+1
  }
}

function makeExampleJSON(){
  var tt_data = {}
  tt_data.time_slots = [new time_slot(1,6,22, 1),
                      new time_slot(2,6,22, 2),
                      new time_slot(3,6.5,22, 2),
                      new time_slot(4,6.5,22, 2),
                      new time_slot(5,8,18.25, 2)]
  tt_data.days = new day_info(0,4,0)
  tt_data.session_type = [new session_type(1,"Nothing",2,0), new session_type(1,"General",2,0)]
  return JSON.stringify(tt_data)
}


function validateJSON(){
// times between 24 hr
// Slot finishes after it starts

// Days 0-6
// No repeat ID's


}