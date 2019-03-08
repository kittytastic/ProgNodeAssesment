function generateHTML(tt_json){
    var tt_obj = JSON.parse(tt_json); 

    var temp = find_time_limits(tt_obj)
    var start = temp[0];
    var end = temp[1];
    var step = 0.25
    
    var n_rows = tt_obj.days.length;
    var n_cols = (end - start) / step
    console.log("Start:"+start)
    console.log("End: "+end)
    console.log("n_rows: "+n_rows)
    console.log("n_col: "+n_cols)


    // Declare table beginning and end
    var table_start = "<table class = 'ttable ui tablet computer only'><tbody>"
    var table_end = "</tbody></table>"
  
    // Start building table
    var table_html = ""
    table_html += table_start
    
    

    // ----------------- Add row headings (times) ----------------- 
    col_per_hour = 1/step;
    start_pad = (Math.ceil(start)-start) / step
    
    table_html += "<tr>"
    table_html += "<td colspan = '"+start_pad+"' class='tt_headers tt_first_header'></td>"

    let rel_time = 0
    for(let i = start_pad; i<n_cols-col_per_hour; i+=col_per_hour){
        rel_time = start + i *step;

        if (Math.round(rel_time)!=rel_time){
            error("Trying to add time heading that aren't a whole number")
        }
        
        table_html+="<td colspan = '"+col_per_hour+"' class='tt_headers'><div>"+rel_time+":00</div></td>"
       
    }

    console.log(end)
    end_pad = (end-Math.floor(end)) / step

    if(end_pad == 0){
        // Add left float and right float box
        table_html+="<td colspan = '"+col_per_hour+"' class='tt_headers tt_last_header'><div>"+(rel_time+1)+":00</div><div class='tt_headers_right'>"+(rel_time+2)+":00</div></td>"
    }else{
        // Add left float only
        table_html+="<td colspan = '"+end_pad+"' class='tt_headers'><div class='tt_headers_left'>"+(rel_time+1)+":00</div></td>"
    }


    table_html += "</tr>"

    /* What happens if the finish time isn't a whole number */

    // ----------------- Add days and sessions -----------------
    
    
      for(let i = 0 ; i<n_rows; i++){
        table_html += "<tr class = 'tt_day_row'>"
        let time_of_day = start;
        while(time_of_day < end){
            let session_id = is_start_of_time_slot(tt_obj, time_of_day, i);
            
            // If this time is a session
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
      }
  
    // Add close table
    table_html += table_end

    
    


    return generateCSS(tt_obj)+table_html

}

function generateCSS(tt_obj){
    out_css = "<style>";
    n_sesh = tt_obj.session_type.length;
    for(let i = 0; i < n_sesh; i++){
        out_css += ".session-"+i+" {background-color:"+tt_obj.session_type[i].col+" !important;} "
    }
    out_css += "</style>"
    return out_css;
}


function is_start_of_time_slot(tt_obj, time, day){
    n_slots = tt_obj.days[day].length
    for(let i = 0; i<n_slots; i++){
        if(tt_obj.days[day][i].start == time){
            return i
        }
    }

    return -1;

}

function find_time_limits(tt_data){
    console.log("Finding most extreme times ")
    largest = 0;
    smallest = 24;


    n_days = tt_data.days.length;
    for(i =0; i< n_days; i++){
        n_slots = tt_data.days[i].length;
        for(j =0; j<n_slots; j++){
            console.log(tt_data.days[i][j])

            if(tt_data.days[i][j].start < smallest){
                smallest = tt_data.days[i][j].start;
            }

            if(tt_data.days[i][j].end > largest){
                largest = tt_data.days[i][j].end;
            }
        }
    }
    console.log("Earliest Start "+smallest);
    console.log("Latest End "+largest);

    return [smallest, largest]

}