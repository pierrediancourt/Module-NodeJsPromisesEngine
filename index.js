const Q = require("q");
const batchEngine = require("./batch");
const chainEngine = require("./chain");
const parallelizeEngine = require("./parallelize");
const retryEngine = require("./retry");
const getConfig = require("./config");
const Action = require("./action");

//PRIVATE

//PUBLIC

/////
// run batch actions
// => returns the results of all the completed actions as an array in actions' order
/////
function batch(actions, size, continueOnErrors = null, retryCount = null, delayTime = null, ensureFullSuccess = null, batchDelay = null){
	if(actions.constructor !== Array){
		console.error("This method requires an array as first parameter");
		return new Error("This method requires an array as first parameter");
	}else{
		for(var i = 0; i < actions.length; i++){
			if(!actions[i] instanceof Action){
				console.error("This method requires an array of Actions as first parameter");
				return new Error("This method requires an array of Actions as first parameter");
			}
		}
	}

	if(size > actions.length){
		console.error("This method requires a second parameter lesser or equal to the first parameter's length");
		return new Error("This method requires a second parameter lesser or equal to the first parameter's length");
	}

	var config = getConfig(retryCount, delayTime, ensureFullSuccess, batchDelay, continueOnErrors);
	return batchEngine.runBatch(actions, size, config);
}

/////
// run actions in chain
// => returns the result of the last completed action of the chain
/////
function chain(actions){
	if(actions.constructor !== Array){
		console.error("This method requires an array as first parameter");
		return new Error("This method requires an array as first parameter");
	}else{
		for(var i = 0; i < actions.length; i++){
			if(!actions[i] instanceof Action){
				console.error("This method requires an array of Actions as first parameter");
				return new Error("This method requires an array of Actions as first parameter");
			}
		}
	}

	return chainEngine.runChain(actions);
}



function retry(action, retryCount = null, delayTime = null, ensureFullSuccess = null){
	if(!action instanceof Action){
		console.error("This method requires an array of Actions as first parameter");
		return new Error("This method requires an array of Actions as first parameter");
	}

	var config = getConfig(retryCount, delayTime, ensureFullSuccess);
	return retryEngine.runRetry(action, config);
}

/////
// run actions in parallel
// can wait for all of them to complete (either success or failure)
// => returns the results of all the completed actions as an array in actions' order
/////
function parallelize(actions, continueOnErrors = null, retryCount = null, delayTime = null, ensureFullSuccess = null){
	if(actions.constructor !== Array){
		console.error("This method requires an array as first parameter");
		return new Error("This method requires an array as first parameter");
	}else{
		for(var i = 0; i < actions.length; i++){
			if(!actions[i] instanceof Action){
				console.error("This method requires an array of Actions as first parameter");
				return new Error("This method requires an array of Actions as first parameter");
			}
		}
	}

	var config = getConfig(retryCount, delayTime, ensureFullSuccess, null, continueOnErrors);
	return parallelizeEngine.runParallelize(actions, config);
}

/////
// run actions concurrently
// can wait for the first to succeed
// => returns its result
// or can wait for the first to fail to
// => returns its result
/////
/*function runConcurrentlyActionsFirstToSuccess(actionsToRunConcurrently){

}

	
function runConcurrentlyActions(actionsToRunConcurrently){
	var promises = []
	for(var i = 0; i < actionsToParallelize.length; i++){
		promises.push(actionsToParallelize[i].apply());
	}

	return Q.any(actionsToRunConcurrently)
		.then(function (first) {
		    // Any of the promises was fulfilled.
		}, function (error) {
		    // All of the promises were rejected.
		});
}*/

function ensureCatchedErrors(promise){
	promise.done();
}

module.exports = {
	batch : batch,
	retry : retry,
	parallelize : parallelize,
	chain : chain,
	ensureCatchedErrors : ensureCatchedErrors,
	Action : Action
}