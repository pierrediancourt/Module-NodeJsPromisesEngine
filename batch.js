const Q = require("q");
const parallelizeEngine = require("./parallelize");

//PRIVATE
function makeBatchArray(actions, size){
	var batches = [];
	for(var i = 0; i < actions.length; i += size){
		batches.push(actions.slice(i, i+size));
	}
	return batches;
}

//PUBLIC
function runBatch(actions, size, config){
	var batches = makeBatchArray(actions, size);
	var resultPromise = Q.delay(1);
	var results = [];
	for(var i = 0; i < batches.length; i++){
		let j = i;

		var parallelizePromise = resultPromise.then(function(){
			var promise = parallelizeEngine.runParallelize(batches[j], config);
			if(config.batchDelay > 0 && j != batches.length-1){ //we add some delay only if we have still some for loop to run
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