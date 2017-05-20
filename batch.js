const Q = require("q");
const parallelizeEngine = require("./parallelize");

//PRIVATE
function makeBatchArray(actions, params, size){
	var batchArray = {};
	batchArray.actions = [];
	batchArray.params = [];
	for(var i = 0; i < actions.length; i += size){
		batchArray.actions.push(actions.slice(i, i+size));
		if(params != null && params.length > 0){
			batchArray.params.push(params.slice(i, i+size));
		}
	}
	return batchArray;
}

//PUBLIC
function runBatch(actions, params, size, config){
	var batchArray = makeBatchArray(actions, params, size);
	var batchActions = batchArray.actions;
	var batchParams = batchArray.params;
	var resultPromise = Q.delay(1);
	var results = [];
	for(var i = 0; i < batchActions.length; i++){
		let j = i;

		var parallelizePromise = resultPromise.then(function(){			
			if(typeof batchParams[j] === "undefined"){
				batchParams[j] = [];
			}
			
			var promise = parallelizeEngine.runParallelize(batchActions[j], batchParams[j], config);
			if(config.batchDelay > 0 && j != batchActions.length-1){ //we add some delay only if we have still some for loop to run
				//console.log("adding delay "+j)
				return Q.delay(config.batchDelay)
			        .then(function () {
			            return promise;
			        });
			}

			return promise;
		});
		resultPromise = parallelizePromise;
		results.push(parallelizePromise);
	}

	var deferred = Q.defer();
	var resultArray = [];
	for(var i = 0; i < results.length; i++){
		results[i].then(function(rslts){
			for(var j = 0; j < rslts.length; j++){
				resultArray.push(rslts[j]);					
			}
			
			if(resultArray.length == actions.length){
				deferred.resolve(resultArray);
			}
		});
	}

	return deferred.promise;
} 


module.exports = {
	runBatch : runBatch
}