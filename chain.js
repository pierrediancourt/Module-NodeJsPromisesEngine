const Q = require("q");

//PUBLIC
function runChain(actions, initialParam){
	return actions.reduce(Q.when, Q(initialParam));
}

module.exports = {
	runChain : runChain
}