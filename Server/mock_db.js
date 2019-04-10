
const tt_tools = require('./tt_tools.js')

function mockComments(){
  let small_content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. "
    let mid_content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vulputate metus ipsum, vitae finibus elit maximus vel. Phasellus magna velit, iaculis eu scelerisque a, tincidunt non lectus"
    let large_content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vulputate metus ipsum, vitae finibus elit maximus vel. Phasellus magna velit, iaculis eu scelerisque a, tincidunt non lectus. Praesent accumsan lacinia dolor, et ultricies tortor imperdiet vitae. Sed ultricies et elit eu consectetur."
    

    let mock_comment_obj = []

    let c_id = 0;

    for(let i = 0; i<3; i++){
        let comment = {};
        comment.title = "Doge forever "+c_id
        comment.content = small_content;
        comment.timestamp = "now" 
        comment.c_id = c_id;
        c_id +=1;
        mock_comment_obj.push(comment)

        comment = {};
        comment.title = "Doge forever "+c_id
        comment.content = mid_content;
        comment.timestamp = "now"
        comment.c_id = c_id;
        c_id +=1; 
        mock_comment_obj.push(comment)

        comment = {};
        comment.title = "Doge forever "+c_id
        comment.content = large_content;
        comment.timestamp = "now"
        comment.c_id = c_id;
        c_id +=1; 
        mock_comment_obj.push(comment)
    }

    return mock_comment_obj;

}

function mockComment(){
 
        comment = {};
        comment.title = "Doge forever "
        comment.content = ' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vulputate metus ipsum, vitae finibus elit maximus vel. Phasellus magna velit, iaculis eu scelerisque a, tincidunt non lectus';
        comment.timestamp = "now"
        comment.c_id = 0;

        return comment;
}

let tt = []
let comments = []

function start(){
  
  for(let i=0; i<5; i++){
    tt.push([]);
    comments.push([]);
    

    for(let j=0; j<2; j++){
     
      tt[i].push(tt_tools.mock_tt());
      comments[i].push(mockComments());
    }
  }

 
}

module.exports = {
    start: function(){start()},
    load_tt: function (tt_id, u_id) {
      if(u_id>=tt.length){
        return false;
      }

      if(tt_id>=tt[u_id].length){
        return false;
      }
      
      return tt[u_id][tt_id];
    },
    list_timetable_names: function(uu_id){
      let names = []

      if(!uu_id){
        for(let i=0; i<tt.length; i++){
          for(let j=0; j<tt[i].length; j++){
            names.push({title: tt[i][j].meta.name, tt_id:j, u_id:i })
          }
        }
      }else{
        if(uu_id>=tt.length){
          return false;
        }

        for(let j=0; j<tt[uu_id].length; j++){
          names.push({title: tt[uu_id][j].meta.name, tt_id:j, u_id:uu_id })
        }

      }
      return names;
    },

    load_all_comments: function(tt_id, u_id){
      if(u_id>=comments.length){
        return false;
      }
      if(tt_id>=comments[u_id].length){
        return false;
      }
      return comments[u_id][tt_id];
    },
    load_comment: function(tt_id, u_id, c_id){
      if(u_id>=comments.length){
        return false;
      }
      if(tt_id>=comments[u_id].length){
        return false;
      }
      if(c_id>=comments[u_id][tt_id].length){
        return false;
      }
      
      for(let i=0; i<comments[u_id][tt_id].length; i++){
        if(comments[u_id][tt_id][i].c_id == c_id){
          return comments[u_id][tt_id][i]
        }
      }
      return false;
    },
    add_comment: function(tt_id, u_id, t, com, ts){
      if(u_id>=comments.length){return false;}
      if(tt_id>=comments[u_id].length){return false;}

      comments[u_id][tt_id].push({
        title: t, 
        content:com, 
        timestamp:ts, 
        com_id:(comments[u_id][tt_id][comments[u_id][tt_id].length-1].com_id +1 )})
    } ,

    delete_comment: function(tt_id, u_id, c_id){
      if(u_id>=comments.length){return false;}
      if(tt_id>=comments[u_id].length){return false;}


      for(let i=0; i<comments[u_id][tt_id].length; i++){
        if(comments[u_id][tt_id][i].c_id == c_id){
          comments[u_id][tt_id].splice(i, 1)
          return true
        }
      }

      return false;

    } 


  };