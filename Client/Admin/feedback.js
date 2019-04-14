// From admin.js
/* global global_u_id, global_tt_id */

// From serverConnect.js
/* global serverDeleteFeedback, serverGetFeedback */

/* exported initFeedback, deleteComment */

let comment_obj={};

function initFeedback(){

	serverGetFeedback(global_tt_id, global_u_id, function(){drawComments();}, function(){});

}


function drawComments(){
   
	let all_comments_html = '';
	if(comment_obj.length==0){
		all_comments_html += '<h2>No comments to display</h2>';
	}
	for(let i=0; i< comment_obj.length; i++){
		all_comments_html += commentHTML(i, comment_obj[i].title, comment_obj[i].content, getDaysAgo(comment_obj[i].timestamp));
	}

	$('#feedback-box').html(all_comments_html);
}

function commentHTML(local_id, title, content, days_ago){
	let comment_html = '<div class="ui card"><div class="content"><i class="right floated trash icon" onclick="deleteComment('+local_id+', this)"></i><div class="header">';
	comment_html+= title;
	comment_html+='</div><div class="meta"><span>';
	if(days_ago==0){
		comment_html += 'today';
	}else if(days_ago==1) {
		comment_html += '1 day ago';
	}else {
		comment_html += days_ago + ' days ago';
	}
	comment_html+= '</span></div><p>';
	comment_html+= content;
	comment_html+='</p></div></div>';
	return comment_html;    
} 

function getDaysAgo(timestamp){
	let today = new Date();
	let day = new Date(timestamp);

	const diffTime = Math.abs(today.getTime() - day.getTime());
	const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
    
	return diffDays;
}

function deleteComment(id, dom_obj){

	serverDeleteFeedback(comment_obj[id].c_id, function () {
		removeCommentObj(id);
		$(dom_obj).closest('.card').fadeOut(200, function() {
			drawComments();
		});
	});
}

function removeCommentObj(local_id){
	comment_obj.splice(local_id, 1);
}
