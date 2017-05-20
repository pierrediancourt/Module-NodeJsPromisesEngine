const Q = require("q");
const Action = require("./action");

//PRIVATE
function retryAllRecursion(actions, config)
{
	var map = new Map();
	var promises = []
	for(var i = 0; i < actions.length; i++){
		promises.push(actions[i].getFunction().apply(null, actions[i].getParams()));
		map.set(actions[i], null); //initialising map with action as key, will store results later instead of null
	}

	return Q.allSettled(promises)
		.then(function(results){

			var failedActions = []
			for(var i = 0; i < promises.length; i++){				
				if(results[i].state === "fulfilled"){
					//console.log("action "+i+" : fulfilled and returned value : "+results[i].value);
					map.set(actions[i], results[i].value);
				}else{
					//a promise or more have been rejected
					if(config.retryCount == 0){
			        	console.log("The promise was rejected. No retries remaining");
			        	console.log("The promise threw this error : "+results[i].reason);
			            throw new Error("The promise was rejected. No retries remaining");
			        }
			        //console.log("The promise was rejected. Retries remaining : "+config.retryCount+" waiting "+config.delayTime+" ms before next retry.");
			        //console.log("The promise threw this error : "+results[i].reason);

					failedActions.push(actions[i]);
					map.set(actions[i], "rejected at attempt "+config.retryCount);
				}
			}

			if(failedActions.length > 0){
				//console.log("failedActions : "+failedActions)
			    var promise = Q.delay(config.delayTime)
			        .then(function () {
			            return retryAllRecursion(failedActions, config.retryCount-1, config.delayTime*2);
			        });
			    return promise.then(function(result){ //is a map
		        	//merge maps
		        	for (var [key, value] of result) {
					    map.set(key, value);
					}

					return map;
			    });  
			}

		    return map;
		})
}

//PUBLIC
function runRetry(action, config){
	return action.getFunction().apply(null, action.getParams())
	    .then(function(d){
	        return Q(d);
	    })
		.fail(function(error){
			if(config.retryCount == 0){
	        	console.log("The promise was rejected. No retries remaining");
	        	console.log("The promise threw this error : "+error);
	            throw new Error("The promise was rejected. No retries remaining");
	        }
	        //console.log("The promise was rejected. Retries remaining : "+config.retryCount+" waiting "+config.delayTime+" ms before next retry.");
	        //console.log("The promise threw this error : "+error);
	        return Q.delay(config.delayTime)
		        .then(function () {
		            return runRetry(action, param, config.retryCount-1, config.delayTime*2);
		        });
		});
}

function runRetryAll(actions, config){
	var map = new Map();
	var promises = []
	for(var i = 0; i < actions.length; i++){
		promises.push(actions[i].getFunction().apply(null, actions[i].getParams()));
		map.set(actions[i], null); //initialising map with action as key, will store results later instead of null
	}

	return Q.allSettled(promises)
		.then(function(results){
			var finalResultsIfAllSuccessfulWithoutAnyRetry = []

			var failedActions = []
			for(var i = 0; i < promises.length; i++){				
				if(results[i].state === "fulfilled"){
					//console.log("action "+i+" : fulfilled and returned value : "+results[i].value);
					finalResultsIfAllSuccessfulWithoutAnyRetry[i] = results[i].value;
					map.set(actions[i], results[i].value);
				}else{ //a promise or more have been rejected
			        //console.log("The promise was rejected. Retries remaining : "+retryCount+" waiting "+delayTime+" ms before next retry.");
			        //console.log("The promise threw this error : "+results[i].reason);
					failedActions.push(actions[i]);
					map.set(actions[i], "rejected at attempt "+config.retryCount);
				}
			}

			if(failedActions.length > 0){
				//console.log("failedActions : "+failedActions)
			    var promise = Q.delay(config.delayTime)
			        .then(function () {
			            return retryAllRecursion(failedActions, config.retryCount-1, config.delayTime*2);
			        });
		        return promise.then(function(result){ //is a map
		        	//merge maps
		        	for (var [key, value] of result) {
					    map.set(key, value);
					}

					return [...map.values()]; //new array created from the values of the map
			    });	
			}

		    return finalResultsIfAllSuccessfulWithoutAnyRetry;
		})
}


module.exports = {
	runRetry : runRetry,
	runRetryAll : runRetryAll
}