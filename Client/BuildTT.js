function generateHTML(tt_json){
    var tt_obj = JSON.parse(tt_json); 

    console.log(tt_obj)
    console.log(tt_json)

    var temp = find_time_limits(tt_obj)
    var start = temp[0];
    var end = temp[1];
    
    
    var n_rows = tt_obj.days.length;
  
    
    var step = 0.25
  

    var n_cols = (end - start) / step
    console.log("Start:"+start)
    console.log("End: "+end)
    console.log("n_rows: "+n_rows)
    console.log("n_col: "+n_cols)

    var table_start = "<table class = 'ttable ui tablet computer only'><tbody>"
    var table_end = "</tbody></table>"
  
    var table_html = ""
    table_html += table_start
    
    table_html += "<tr>"

    col_per_hour = 1/step;
    start_pad = (Math.ceil(start)-start) / step
    table_html += "<td colspan = '"+start_pad+"'></td>"

    for(let i = start_pad; i<n_cols; i+=col_per_hour){
        rel_time = start + i *step;
        if (Math.round(rel_time)==rel_time){
            table_html+="<td colspan = '"+col_per_hour+"' class='tt_headers'><div>"+rel_time+"</div></td>"
        }else{
            table_html+="<td></td>"
        }
        
    }
    table_html += "</tr>"

      for(let i = 0 ; i<n_rows; i++){
        table_html += "<tr>"
        let j = start;
        while(j < end){
            //related_time = start + j*step; 
            related_time = j;
            var sesh = is_start_of_time_slot(tt_obj, related_time, i);
            if(sesh>-1){
                console.log("Session "+tt_obj.days[i][sesh].session+" is at this time: "+related_time+ " on day: "+i)
                let dur = tt_obj.days[i][sesh].end - tt_obj.days[i][sesh].start
                if(dur<=0){
                    j += step;
                    table_html += "<td class = 'session-none'></td>";
                    console.log("ERROR rendering day, session starts after it ends")
                }else{
                    let width = dur/step;
                    console.log("Adding session width: "+width);
                    table_html += "<td class = 'session-"+tt_obj.days[i][sesh].session+"' colspan='"+width+"'></td>"
                    j = tt_obj.days[i][sesh].end
                }
            }else{
                table_html += "<td class = 'session-none'></td>";
                j += step;
            }
        }
        table_html += "</tr>"
      }
  
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
