let comment_obj={};

function initFeedback(){
    let mock_json = mock_comments_json()

    comment_obj = JSON.parse(mock_json)
    drawComments()
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

    serverDelete(comment_obj[id].global_id, function () {
        removeCommentObj();
        $(dom_obj).closest('.card').fadeOut(200, function() {
            drawComments();
        });
    });
}

function removeCommentObj(local_id){
    comment_obj.splice(local_id, 1);
}

function serverDelete(global_id, success_callback){
    console.log("Deleting comment from server with global id: "+global_id)
    let success = false;

    if(success){
        success_callback();
    }else{
        info_error_comm_delete();
    }
}

function serverGet(){
console.log("Getting comments from server ");



}


function mock_comments_json(){
    let small_content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. "
    let mid_content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vulputate metus ipsum, vitae finibus elit maximus vel. Phasellus magna velit, iaculis eu scelerisque a, tincidunt non lectus"
    let large_content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vulputate metus ipsum, vitae finibus elit maximus vel. Phasellus magna velit, iaculis eu scelerisque a, tincidunt non lectus. Praesent accumsan lacinia dolor, et ultricies tortor imperdiet vitae. Sed ultricies et elit eu consectetur."
    

    let mock_comment_obj = []

    let global_id = 0;

    for(let i = 0; i<3; i++){
        let comment = {};
        comment.title = "Doge forever "+global_id
        comment.content = small_content;
        comment.timestamp = "now" 
        comment.global_id = global_id;
        global_id +=1;
        mock_comment_obj.push(comment)

        comment = {};
        comment.title = "Doge forever "+global_id
        comment.content = mid_content;
        comment.timestamp = "now"
        comment.global_id = global_id;
        global_id +=1; 
        mock_comment_obj.push(comment)

        comment = {};
        comment.title = "Doge forever "+global_id
        comment.content = large_content;
        comment.timestamp = "now"
        comment.global_id = global_id;
        global_id +=1; 
        mock_comment_obj.push(comment)
    }

    return JSON.stringify(mock_comment_obj)


}