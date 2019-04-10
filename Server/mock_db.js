
const tt_tools = require('./tt_tools.js')

function mockComments(){
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

    return mock_comment_obj;

}

function mockComment(){
 
        comment = {};
        comment.title = "Doge forever "
        comment.content = ' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vulputate metus ipsum, vitae finibus elit maximus vel. Phasellus magna velit, iaculis eu scelerisque a, tincidunt non lectus';
        comment.timestamp = "now"
        comment.global_id = 0;

        return comment;
}


module.exports = {
    load_tt: function (tt_id, u_id) {
      return tt_tools.mock_tt();
    },
    load_all_comments: function(tt_id, u_id){
      return mockComments();
    },
    load_comment: function(tt_id, u_id, c_id){
      return mockComment();
    }
  };