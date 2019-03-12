function generateHTML(tt_json){
    var tt_obj = JSON.parse(tt_json); 

    var temp = find_time_limits(tt_obj)
    var start = temp[0];
    var end = temp[1];
    var step = 0.25
    let day_name_span = 4

    var n_rows = tt_obj.days.length;
    var n_cols = (end - start) / step


    var day_names = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday","Sunday"]

    // Declare table beginning and end
    var table_start = "<table class = 'ttable ui tablet computer only'><tbody>"
    var table_end = "</tbody></table>"
  
    // Start building table
    var table_html = ""
    table_html += table_start
    
    
    // ----------------- Add row headings (times) ----------------- 
    let col_per_hour = 1/step;
    let start_pad = (Math.ceil(start)-start) / step
    
    table_html += "<tr class='tt_header_row'>"
    
    // Add top left td that runs from the start to the first hour
    table_html +="<td colspan = '"+(day_name_span+start_pad)+"' class='tt_headers_no_tick'><div>"+Math.ceil(start)+":00</div></td>"
    

    let rel_time = 0
    for(let i = start_pad; i<n_cols-col_per_hour; i+=col_per_hour){
        rel_time = start + i * step;    

        // Add the label for the next hour
        table_html+="<td colspan = '"+col_per_hour+"'><div>"+(rel_time+1)+":00</div></td>"
    }

   
    let end_pad = (end-Math.floor(end)) / step

    // If tt finishes on a whole hour
    if(end_pad == 0){
        // Add last hour to time table
        table_html+="<td colspan = '"+col_per_hour+"' id='tt_headers_end'><div>"+(rel_time+2)+":00</div></td>"
    }else{
        // Add last <hour padding to table
        table_html+="<td colspan = '"+end_pad+"'></td>"
    }

    table_html += "</tr>"


    // ----------------- Add days and sessions -----------------
    
    var curr_day = tt_obj.meta.start_day;
    
        // For every day row
      for(let i = 0 ; i<n_rows; i++){
        if(i==(n_rows-1)){
            table_html += "<tr class = 'tt_day_row' id='tt_end_row'>"
        }else{
            table_html += "<tr class = 'tt_day_row'>"
        }
        
        // Add day name
        table_html +="<td colspan='"+day_name_span+"' class = 'tt-days'><div>"+day_names[curr_day]+"</div></td>"
        
        // Start at time the beginning of the day
        let time_of_day = start;

        // While it isn't the end of the day
        while(time_of_day < end){

            let session_id = is_start_of_time_slot(tt_obj, time_of_day, i);
            
            // If this time is the beginning of a session
            if(session_id>-1){

                // Calculate duration of session
                let dur = tt_obj.days[i][session_id].end - tt_obj.days[i][session_id].start
                
                // Check for errors
                if(dur<=0){
                    time_of_day += step;
                    table_html += "<td class = 'session-none'></td>";
                    error("rendering day, session starts after it ends")
                }else{
                    // No errors
                    // Calculate width of session and add to output html
                    let width = dur/step;
                    table_html += "<td class = 'session-"+tt_obj.days[i][session_id].session+"' colspan='"+width+"'></td>"
                    
                    // Set next time to look at at the end of this session
                    time_of_day = tt_obj.days[i][session_id].end
                }
            
            }else{
                // No session on add blank box 
                table_html += "<td class = 'session-none'></td>";
                time_of_day += step;
            }
        }

        // Done for the day
        table_html += "</tr>"
        curr_day = (curr_day +1) % 7

      }
  
    // Add close table
    table_html += table_end

    

    // ----------- Generate the table css ----------------
    let css = generateCSS(tt_obj)


    return css+table_html

}

// Generates the css background colour for all the sessions
function generateCSS(tt_obj){
    let out_css = "<style>";
    let n_sessions = tt_obj.session_type.length;
    for(let i = 0; i < n_sessions; i++){
        out_css += ".session-"+i+" {background-color:"+tt_obj.session_type[i].col+" !important;} "
    }
    out_css += "</style>"
    return out_css;
}


function is_start_of_time_slot(tt_obj, time, day){
    let n_slots = tt_obj.days[day].length
    for(let i = 0; i<n_slots; i++){
        if(tt_obj.days[day][i].start == time){
            return i
        }
    }

    return -1;
}

// Checks all sessions to find the most extreme time values
function find_time_limits(tt_data){
    let largest = 0;
    let smallest = 24;


    let n_days = tt_data.days.length;
    for(let i = 0; i< n_days; i++){
        let n_slots = tt_data.days[i].length;
        for(let j = 0; j<n_slots; j++){

            if(tt_data.days[i][j].start < smallest){
                smallest = tt_data.days[i][j].start;
            }

            if(tt_data.days[i][j].end > largest){
                largest = tt_data.days[i][j].end;
            }
        }
    }
    
    return [smallest, largest]
}


function generateMobileTT(tt_json){
    var tt_obj = JSON.parse(tt_json);

    let day_names = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday","Sunday"]

    let outHTML = ""
    outHTML += generateCSS(tt_obj)

    let first_day = tt_obj.meta.start_day
    for(let i =0; i < tt_obj.days.length; i++){
        outHTML +='<div class = "column">'
        outHTML += '<table class="colour_me"><tbody>'
        outHTML += '<tr><td></td><td></td><td><h1>'+day_names[(first_day+i)%7]+'</h1></td></tr>'
        outHTML += days_table_body(tt_obj, i)
        outHTML += '</tbody></table>'
        outHTML+='</div>'
    }

    return outHTML;
}

function days_table_body(tt_obj, day_i){
    

    let temp = find_time_limits(tt_obj)
    let start = temp[0];
    let end = temp[1];

    let dur = end - start
    let step = 0.25

    let n_time_units = dur/step 
    let hour_step_len = 1/step

    let start_pad = (Math.ceil(start)-start) / step
    let dayHTML = ''

    let in_session = false;
    let session_end = 0;

    let last_hour = Math.floor(end)
    let end_pad = (end - Math.floor(end)) / step


    for(let i=0; i< n_time_units; i++){
        let  curr_time = start + i*step;
        
        dayHTML += '<tr>'

        if(i<start_pad){
            dayHTML += '<td></td>'
            dayHTML += '<td class="tick_width"></td>'
        }

        if(is_on_hour(curr_time)){
            let hour_box_len = hour_step_len
            if (curr_time == last_hour){
                hour_box_len = end_pad
            }

            dayHTML += '<td rowspan="'+hour_box_len+'"><div>'+curr_time+':00</div></td>'
            dayHTML += '<td rowspan="'+hour_box_len+'" class="tick_width tick_mark"></td>'
        }

        if(curr_time==session_end){
            in_session = false;
        }

        if(!in_session){
           let session_id =  is_start_of_time_slot(tt_obj, curr_time, day_i);

           if(session_id != -1){
            let dur_steps = (tt_obj.days[day_i][session_id].end - tt_obj.days[day_i][session_id].start)/step
            if(dur_steps>0){
               in_session = true;
               session_end = tt_obj.days[day_i][session_id].end
               
               console.log("Adding session of length "+dur_steps)
               dayHTML+= '<td class = "session-'+session_id+'  session" rowspan = '+dur_steps+'></td>'
            }else{
                dayHTML+= "<td class = 'session-none'></td>"
            }
           } else {

               dayHTML+= "<td class = 'session-none'></td>"
           }
        }

        dayHTML += '</tr>'

        
    }
    
    return dayHTML
}

function is_on_hour(time){
    if(time-Math.round(time)!=0){return false}
    else{return true}
}

// Not used
// Return next session transition, this could be at curr time of after
function get_next_session_change(tt_obj, curr_time, day_i){
    let next_earliest = 24;
    let next_session_id = -1;

    
    
        let n_slots = tt_data.days[day_i].length;
        for(let j = 0; j<n_slots; j++){
            if(tt_data.days[i][j].end-tt_data.days[i][j].start>0){
                if(tt_data.days[i][j].end < next_earliest){
                    if(tt_data.days[i][j].end>=curr_time)
                        next_earliest = tt_data.days[i][j].end;
                }

                if(tt_data.days[i][j].start < next_earliest){
                    if(tt_data.days[i][j].start>=curr_time)
                    next_earliest = tt_data.days[i][j].start;
                }
            }else{
                error("Session finished before it started")
            }
        }
    
    
    return next_earliest;

}
