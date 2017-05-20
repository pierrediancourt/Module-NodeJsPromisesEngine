const Q = require("q");
const batchEngine = require("./batch");
const chainEngine = require("./chain");
const parallelizeEngine = require("./parallelize");
const retryEngine = require("./retry");
const getConfig = require("./config");

//PRIVATE

//PUBLIC

/////
// run batch actions
// => returns the results of all the completed actions as an array in actions' order
/////
function batch(actions, params, size, continueOnErrors = null, retryCount = null, delayTime = null, ensureFullSuccess = null, batchDelay = null){
	if(actions.constructor !== Array){
		console.error("This method requires an array as first parameter");
		return new Error("This method requires an array as first parameter");
	}else{
		for(var i = 0; i < actions.length; i++){
			if(typeof actions[i] !== "function"){
				console.error("This method requires a function or and array of functions as first parameter");
				return new Error("This method requires an array of functions as first parameter");
			}
		}
	}

	if(size > actions.length){
		console.error("This method requires a second parameter lesser or equal to the first parameter's length");
		return new Error("This method requires a second parameter lesser or equal to the first parameter's length");
	}

	var config = getConfig(retryCount, delayTime, ensureFullSuccess, batchDelay, continueOnErrors);
	return batchEngine.runBatch(actions, params, size, config);
}

/////
// run actions in chain
// => returns the result of the last completed action of the chain
/////
function chain(actions, initialParam = null){
	if(actions.constructor !== Array){
		console.error("This method requires an array as first parameter");
		return new Error("This method requires an array as first parameter");
	}

	return chainEngine.runChain(actions, initialParam);
}



function retry(action, param, retryCount = null, delayTime = null, ensureFullSuccess = null){
	if(typeof action !== "function"){
		console.error("This method requires a function as first parameter");
		return new Error("This method requires a function as first parameter");	
	}

	var config = getConfig(retryCount, delayTime, ensureFullSuccess);
	return retryEngine.runRetry(action, param, config);
}

/////
// run actions in parallel
// can wait for all of them to complete (either success or failure)
// => returns the results of all the completed actions as an array in actions' order
/////
function parallelize(actions, params, continueOnErrors = null, retryCount = null, delayTime = null, ensureFullSuccess = null){
	if(actions.constructor !== Array){
		console.error("This method requires an array as first parameter");
		return new Error("This method requires an array as first parameter");
	}else{
		for(var i = 0; i < actions.length; i++){
			if(typeof actions[i] !== "function"){
				console.error("This method requires a function or and array of functions as first parameter");
				return new Error("This method requires an array of functions as first parameter");
			}
		}
	}

	var config = getConfig(retryCount, delayTime, ensureFullSuccess, null, continueOnErrors);
	return parallelizeEngine.runParallelize(actions, params, config);
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
	ensureCatchedErrors : ensureCatchedErrors
}