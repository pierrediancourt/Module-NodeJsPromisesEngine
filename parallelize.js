const Q = require("q");
const retryEngine = require("./retry");

//PUBLIC
function runParallelize(actions, config){
	if(config.ensureFullSuccess){
		return retryEngine.runRetryAll(actions, config);
	}else{
		if(config.continueOnErrors){
			var promises = []
			for(var i = 0; i < actions.length; i++){
				promises.push(actions[i].apply());				
			}

			return Q.allSettled(promises)
				.then(function(results){
					var finalResults = []

					for(var i = 0; i < promises.length; i++){				
						if(results[i].state === "fulfilled"){
							//console.log("action "+i+" : fulfilled and returned value : "+results[i].value);
							finalResults[i] = results[i].value;
						}else{ //a promise or more have been rejected
					        //console.log("The promise was rejected. Retries remaining : "+retryCount+" waiting "+delayTime+" ms before next retry.");
					        //console.log("The promise threw this error : "+results[i].reason);
							
						}
					}

				    return finalResults;
				})
		}else{
			var promises = [];
			for(var i = 0; i < actions.length; i++){
				promises.push(actions[i].apply());
			}

			return Q.all(promises)
				.then(function(results){ //results in the same order of the promises passed to Q.all
					return results;
				})
				.fail(function(error){
					return error;
				});
		}
	}
}

module.exports = {
	runParallelize : runParallelize
}