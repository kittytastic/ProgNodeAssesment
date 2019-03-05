function generateHTML(tt_json){
    var tt_obj = JSON.parse(tt_json); 

    console.log(tt_obj.time_slots)

    var temp = find_time_limits(tt_obj.time_slots)

    var start = 6.0
    var end = 18.0
    var rows = 1
  
    start = temp[0];
    end = temp[1];
    var step = 0.25
  
    var col = (end- start) / step
  
    var table_start = "<table class = 'ttable ui tablet computer only'><tbody>"
    var table_end = "</tbody></table>"
  
    var table_html = ""
    table_html += table_start
  
      for(i = 0 ; i<rows; i++){
        table_html += "<tr>"
        for(j =0; j<col; j++){
            related_time = start + j*step; 
            var temp = is_start_of_time_slot(tt_obj.time_slots, related_time, i);
            if(temp){
                console.log("Session"+this.id+" is at this time: "+related_time+ " on day: "+i)
            }
            table_html += "<td></td>"
        }
        table_html += "</tr>"
      }
  
    table_html += table_end

    return table_html

}


function is_start_of_time_slot(tt_slots, time, relative_day){
    n_slots = tt_slots.length
    for(i =0; i<n_slots; i++){
        if(tt_slots[i].relative_day == relative_day){
            if(tt_slots[i].start==time){
                return tt_slots[i]
            }
        }
    }

    return false;

}

function find_time_limits(tt_time_slots){
    console.log("Finding most extreme times ")
    largest = 0;
    smallest = 24;


    n_slots = tt_time_slots.length
    for(i =0; i<n_slots; i++){
        console.log(tt_time_slots[i].start)

        if(tt_time_slots[i].start < smallest){
            smallest = tt_time_slots[i].start;
        }

        if(tt_time_slots[i].end > largest){
            largest = tt_time_slots[i].end;
        }
    }

    console.log("Earliest Start "+smallest);
    console.log("Latest End "+largest);

    return [smallest, largest]

}


function generateTestHTML(){

    var start = 6.0
    var end = 18.0
    var rows = 7
  
    var step = 0.25
  
    var col = (end- start) / step
  
    var table_start = "<table class = 'ttable ui tablet computer only'><tbody>"
    var table_end = "</tbody></table>"
  
    var table_html = ""
    table_html += table_start
  
      for(i = 0 ; i<rows; i++){
        table_html += "<tr>"
        for(j =0; j<col; j++){
          table_html += "<td></td>"
        }
        table_html += "</tr>"
      }
  
    table_html += table_end

    return table_html

}
