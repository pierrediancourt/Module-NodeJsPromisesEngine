const Q = require("q");
const Action = require("./action");

//PUBLIC
function runChain(actions){
	var initialParam = actions[0].getParams();	
	var arrayFunc = []
	for(var i = 0; i < actions.length; i++){
		arrayFunc.push(actions[i].getFunction());
	}
	if(initialParam.constructor === Array
	&& typeof initialParam[0] === "undefined"){
		return arrayFunc.reduce(Q.when, Q(undefined));
	}
	return arrayFunc.reduce(Q.when, Q(initialParam));
}

module.exports = {
	runChain : runChain
}