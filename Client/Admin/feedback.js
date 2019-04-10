let comment_obj={};

function initFeedback(){
    //let mock_json = mock_comments_json()

    //comment_obj = JSON.parse(mock_json)

    serverGetFeedback(1, 1, function(){drawComments()}, function(){})

    //drawComments()
}


function drawComments(){
   
    let all_comments_html = ''
    for(let i=0; i< comment_obj.length; i++){
        all_comments_html += commentHTML(i, comment_obj[i].title, comment_obj[i].content, getDaysAgo(comment_obj[i].timestamp))
    }

    $('#feedback-box').html(all_comments_html);
}

function commentHTML(local_id, title, content, days_ago){
    let comment_html = '<div class="ui card"><div class="content"><i class="right floated trash icon" onclick="deleteComment('+local_id+', this)"></i><div class="header">'
        comment_html+= title
        comment_html+='</div><div class="meta"><span>'
        if(days_ago==0){
            comment_html += 'today'
        }else if(days_ago==1) {
            comment_html += '1 day ago'
        }else {
            comment_html += days_ago + ' days ago'
        }
        comment_html+= '</span></div><p>'
        comment_html+= content
        comment_html+='</p></div></div>'
    return comment_html;    
} 

function getDaysAgo(timestamp){

    return 1
}

function deleteComment(id, dom_obj){

    serverDelete(comment_obj[id].c_id, function () {
        removeCommentObj();
        $(dom_obj).closest('.card').fadeOut(200, function() {
            drawComments();
        });
    });
}

function removeCommentObj(local_id){
    comment_obj.splice(local_id, 1);
}

function serverDelete(c_id, success_callback){
    console.log("Deleting comment from server with global id: "+c_id)
  

    fetch('/api/feedback?tt_id=1&u_id=1&c_id='+c_id, {method:'delete'})
    .then(status)
    .then(json)
    .then(function(data) {
        console.log('Succeeded with JSON response', data);
        success_callback();
        
    }).catch(function(error) {
        console.log('Request failed', error);
        info_error_comm_delete();
        
    });

}

function serverGetFeedback(tt_id, u_id, success_cb, fail_cb){
console.log("Getting comments from server ");

fetch('/api/feedback?tt_id='+tt_id+'&u_id='+u_id+'&c_id=all')
.then(status)
.then(json)
.then(function(data) {
    console.log('Request succeeded with JSON response', data);
    comment_obj = data;
    if(success_cb){
        success_cb();
    }
}).catch(function(error) {
    console.log('Request failed', error);
   
    if(fail_cb){
        fail_cb();
    }
});



}