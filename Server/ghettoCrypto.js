/* eslint-env node */
const axios = require('axios');
var crypto = require('crypto');


const CLIENT_ID = '9478045862-k3c40ln9u21tu06slm5jrhfvdi6hcbq6.apps.googleusercontent.com';

let mock_users = 5;
let u_id = [];
let u_sesh_tokens = [];
let u_id_db = [];

for(let i = 0; i<mock_users; i++){
	u_id.push(0);
	u_sesh_tokens.push(0);
	u_id_db.push(0);
}


function verifyUser(id_token, success_cb, fail_cb){
	axios.get('https://oauth2.googleapis.com/tokeninfo?id_token='+id_token)
		.then(response => {  
   
			if(response.data.aud == CLIENT_ID){
				var u_hash = crypto.createHash('md5').update(response.data.email).digest('hex');
				let u_id = getUID(u_hash);
				if(success_cb){
					success_cb(u_id, u_sesh_tokens[u_id]);
				}
			}else{
				if(fail_cb){
					fail_cb();
				}
			}
		})
		.catch(error => {
			//console.log(error);
			if(fail_cb){
				fail_cb(error);
			}
		});
}

function getUID(u_hash){

	// Check for user already in system
	let today = new Date();
	let new_sesh_token = u_hash+today.toJSON+ today.getMilliseconds()+ '' + Math.random();
	new_sesh_token = crypto.createHash('md5').update(new_sesh_token).digest('hex');
   
	for(let i=0; i<u_id_db.length; i++){
        
		if(u_hash == u_id_db[i]){            
			u_sesh_tokens[i] = new_sesh_token;
			return i;
		}
	}

	// Add new user
	u_id_db.push(u_hash);

	u_sesh_tokens.push(new_sesh_token);
   
	return u_id_db.length-1;

}

function verify(u_id, token){
    
	if(u_id>=u_sesh_tokens.length){ return false;}

	if(u_sesh_tokens[u_id]==token){
		return true;
	}else{
		return false;
	}
}

module.exports = {
	first_verify: function(id, s, f){
		verifyUser(id, s, f);
	},
	verify: function(u_id, token){
		return verify(u_id, token);
	}
};


