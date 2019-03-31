function generateEditingMenu(json){
    var tt_obj = JSON.parse(json);

    let day_names = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday","Sunday"]
    let outHTML = '<div class="ui accordion edit-menu">'

    outHTML+='<h2 style="text-align: center"> Edit Time Slots</h2>'

    for(let i = 0; i < tt_obj.days.length; i++){
        outHTML += generateEditingDay(tt_obj.days[i], day_names[(tt_obj.meta.start_day + i )%7], tt_obj.session_type)
    }

    outHTML+='<h2 style="text-align: center">Edit Sessison</h2>'

    outHTML += gernerateEditingSessions(tt_obj.session_type)

    outHTML += '</div>'
    return outHTML
}

function generateEditingDay(day_obj, day_name, sessions){
    let outHTML = '<div class="title">'
    outHTML += ' <i class="dropdown icon"></i>'
    outHTML += day_name
    outHTML += '</div>'
    outHTML += '<div class="content"><table><tbody>'
         
   
    
    for(i =0 ; i< day_obj.length; i++){
            outHTML += '<tr>'
            outHTML += '<td>'+timeFormat(day_obj[i].start)+'</td><td>-</td><td>'+timeFormat(day_obj[i].end)+'</td><td>'+sessions[day_obj[i].session].title+'</td>'
            outHTML += '<td><div class="colour-show" style="background-color: '+sessions[day_obj[i].session].col+'"></div></td></tr>'
            outHTML += '</tr>'
        }
        outHTML += '<tr><th colspan=4>Add new activity on '+ day_name +'</th><td><i class="plus icon add-icon"></i></td></tr>'
    outHTML += '</tbody></table></div>'
    return outHTML
}

function gernerateEditingSessions(sesh_obj){
    let outHTML = "<table><tbody>"
    for(let i=0; i<sesh_obj.length; i++){
        outHTML += '<tr><td>'+sesh_obj[i].title+'</td><td>'+colourBox(sesh_obj[i].col)+'</td></tr>'
    }
    outHTML += '<tr><th> Add </th><td><i class="plus icon"></i></td></tr>'
    outHTML += "</tbody></table>"

    return outHTML;
}

function colourBox(colourHex){
    return '<div class="colour-show" style="background-color: '+colourHex+'"></div>'
}

function timeFormat(time){
    let min = time-Math.floor(time);

    if(min==0){
        min = "00"
    }else{
        min = 60 * min;
    }

    let format = ''+Math.floor(time)+':'+min;
    return format;
}