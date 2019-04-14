function error(msg){
	console.log(('%cERROR: '+msg+'\n'+stackTrace()), 'color: #ff0000');
}

function stackTrace() {
	var err = new Error();
	return err.stack;
}

function error_minor(msg){
	console.log('%cMINOR ERROR: '+msg+'\n'+stackTrace(), 'color:#FFA500');
}

function warning(msg){
	console.log('%cWarning: '+msg+'\n'+stackTrace(), 'color:#EEAD0E');
}