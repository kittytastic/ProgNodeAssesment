
/* eslint-env node */

function lorem_ipsum_comments(){
	let small_content = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ';
	let mid_content = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vulputate metus ipsum, vitae finibus elit maximus vel. Phasellus magna velit, iaculis eu scelerisque a, tincidunt non lectus';
	let large_content = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vulputate metus ipsum, vitae finibus elit maximus vel. Phasellus magna velit, iaculis eu scelerisque a, tincidunt non lectus. Praesent accumsan lacinia dolor, et ultricies tortor imperdiet vitae. Sed ultricies et elit eu consectetur.';
    
	let today = new Date();
	let mock_comment_obj = [];

	let c_id = 0;

	for(let i = 0; i<2; i++){
		let comment = {};
		comment.title = 'Lorem ipsum dolor sit '+c_id;
		comment.content = small_content;
		today.setDate(today.getDate()-1);
		comment.timestamp = today.toJSON(); 
		comment.c_id = c_id;
		c_id +=1;
		mock_comment_obj.push(comment);

		comment = {};
		comment.title = 'Lorem ipsum dolor sit '+c_id;
		comment.content = mid_content;
		today.setDate(today.getDate()-1);
		comment.timestamp = today.toJSON();
		comment.c_id = c_id;
		c_id +=1; 
		mock_comment_obj.push(comment);

		comment = {};
		comment.title = 'Lorem ipsum dolor sit '+c_id;
		comment.content = large_content;
		today.setDate(today.getDate()-1);
		comment.timestamp = today.toJSON();
		comment.c_id = c_id;
		c_id +=1; 
		mock_comment_obj.push(comment);
	}

	return mock_comment_obj;
}

module.exports = {
	fq_tt: function(){
		return JSON.parse('{"days":[[{"start":6.5,"end":9,"session":1},{"start":9,"end":12,"session":2},{"start":12,"end":12.75,"session":4},{"start":15,"end":16,"session":0},{"start":12.75,"end":15,"session":2},{"start":16,"end":19,"session":3},{"start":19,"end":22,"session":1}],[{"start":6.5,"end":9,"session":1},{"start":9,"end":16,"session":2},{"start":16,"end":19,"session":3},{"start":19,"end":22,"session":5}],[{"start":6.5,"end":9,"session":1},{"start":9,"end":16,"session":0},{"start":16,"end":19,"session":3},{"start":19,"end":21,"session":5},{"start":21,"end":22,"session":1}],[{"start":6.5,"end":9,"session":1},{"start":9,"end":11.5,"session":2},{"start":11.5,"end":12.5,"session":4},{"start":12.5,"end":16,"session":0},{"start":16,"end":19,"session":3},{"start":19,"end":22,"session":0}],[{"start":6.5,"end":9,"session":1},{"start":9,"end":16,"session":2},{"start":16,"end":18,"session":3},{"start":18,"end":21.5,"session":5}],[{"start":8,"end":10.5,"session":3},{"start":10.5,"end":12,"session":6},{"start":12,"end":15,"session":0},{"start":15,"end":17,"session":7}],[{"start":8,"end":10,"session":2},{"start":10,"end":12,"session":6},{"start":12,"end":14,"session":0},{"start":14,"end":16,"session":7},{"start":16,"end":18,"session":1}]],"session_type":[{"col":"#00bcff","title":"General Swim","status":0},{"col":"#ff00ff","title":"University Swim Club","status":0},{"col":"#0031ff","title":"Lane Swim","status":0},{"col":"#ff2a00","title":"Swim School","status":0},{"col":"#faff00","title":"Aqua fit","status":0},{"col":"#5e00ff","title":"Adult Swim","status":0},{"col":"#ff8d00","title":"Family Fun","status":0},{"col":"#65ff00","title":"Parties","status":0}],"meta":{"start_day":0,"name":"Freeman&#039;s Quay"}}');
	},
	rr_tt: function(){
		return JSON.parse('{"days":[[{"start":9.5,"end":11.5,"session":0},{"start":11.75,"end":15,"session":3},{"start":17,"end":20.75,"session":5},{"start":21,"end":22,"session":4}],[{"start":9.5,"end":11.5,"session":0},{"start":11.75,"end":15,"session":3},{"start":17,"end":20.75,"session":5},{"start":21,"end":22,"session":4}],[{"start":9.5,"end":11.5,"session":0},{"start":11.75,"end":15,"session":3},{"start":17,"end":20.75,"session":5},{"start":21,"end":22,"session":4}],[{"start":9.5,"end":11.5,"session":0},{"start":11.75,"end":15,"session":3},{"start":17,"end":20.75,"session":5},{"start":21,"end":22,"session":4}],[{"start":17,"end":22,"session":1},{"start":13,"end":16.5,"session":3}],[{"start":9.5,"end":11.5,"session":0},{"start":16.5,"end":22,"session":4},{"start":12,"end":16,"session":1}],[{"start":10.5,"end":13.5,"session":2},{"start":16.5,"end":22,"session":4}]],"session_type":[{"col":"#f4bf7c","title":"Breakfast Menu","status":0},{"col":"#f5f17f","title":"All You Can Eat","status":0},{"col":"#b6f99a","title":"Sunday Brunch","status":0},{"col":"#acfcf8","title":"Lunch Menu","status":0},{"col":"#f48a90","title":"Bar Menu Only","status":0},{"col":"#faaef6","title":"Dinner Menu","status":0}],"meta":{"start_day":0,"name":"Ralph&#039;s Restaurant"}}');
	},
	fq_comments: function(){
		let man_data = JSON.parse('[{"title":"Aqua fit","content":"I like the sessions you have on at the moment. Could we get any more?!","timestamp":"2019-04-30T10:12:47.124Z","c_id":0}, {"title":"Eye Sore!","content":"Please can you tone down those colours it looks like the candy man vomited on the screen!","timestamp":"2019-04-30T10:14:24.538Z","c_id":0},{"title":"Adult Lessons","content":"I&#039;m a 73 old man and I have always been scared of swimming. It started when I was swimming in the sea as a child and I got dazeled my the sun. I lost track of which was was up and I ended up upside down. I haven&#039;t swam since then. But now my grandchildren want to go swimming and I keep making excuses. I would love it if you could put some adult swimming lessons on it the middle of the day. Kind Regards. Kennith .","timestamp":"2019-04-30T10:18:25.985Z","c_id":0},{"title":"Not good enough!","content":"I want to go swimming 16:00 - 19:00, but you have kids lessons then every day! not all of us have kids and I should have to suffer because of someone else&#039;s kids. NOT impressed.","timestamp":"2019-04-30T10:20:00.785Z","c_id":0}]');
		let auto_data = lorem_ipsum_comments();
		return man_data.concat(auto_data);
	},
	rr_comments: function(){
		let man_data = JSON.parse('[{"title":"YASSSS!","content":"You do the best breakfast menu&#039;s ever!!!!","timestamp":"2019-04-30T10:29:06.534Z","c_id":0},{"title":"Closed?","content":"Wait are you closed 15:00 - 17:00. Please can you clarify this?","timestamp":"2019-04-30T10:30:12.763Z","c_id":0},{"title":"Taco Tuesday","content":"Where has taco Tuesday gone. I lived for taco Tuesday :( ","timestamp":"2019-04-30T10:31:24.523Z","c_id":0},{"title":"Beautiful","content":"You have the best looking timetable I have seen. The kids and I will be sure to come along and check you out! ","timestamp":"2019-04-30T10:32:57.123Z","c_id":0}]');
		let auto_data = lorem_ipsum_comments();
		return man_data.concat(auto_data);
	}
};


