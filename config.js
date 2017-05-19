var globalConfig = {
	delayTime : 1000,
	retryCount : 5,
	ensureFullSuccess : true,
	batchDelay : 1000,
	continueOnErrors : true
}

function setGlobalConfig(){
	
}

function getConfig(retryCount = null, delayTime = null, ensureFullSuccess = null, batchDelay = null, continueOnErrors = null){
	var config = globalConfig;
	if(retryCount != null){	
		if(typeof retryCount === "number"){	
			if(retryCount >= 0){
				config.retryCount = retryCount;
			}else{
				//WARN the user that the retryCount should be positive
			}			
		}
	}

	if(delayTime != null){
		if(typeof delayTime === "number"){
			if(delayTime >= 0){
				config.delayTime = delayTime;
			}else{
				//WARN the user that the delayTime should be positive
			}		
		}
	}

	if(ensureFullSuccess != null){
		if(typeof ensureFullSuccess === "boolean" 
		|| (typeof ensureFullSuccess === "number" && (ensureFullSuccess === 0 || ensureFullSuccess === 1))){
			if(ensureFullSuccess){
				if(config.retryCount <= 0){
					//WARN the user that we overrided automatically its config and/or passed param
					config.retryCount = 1;
				}
			}
			config.ensureFullSuccess = ensureFullSuccess;		
		}
	}

	if(batchDelay != null){
		if(typeof batchDelay === "number"){	
			if(batchDelay >= 0){
				config.batchDelay = batchDelay;
			}else{
				//WARN the user that the batchDelay should be positive
			}
		}
	}

	if(continueOnErrors != null){
		if(typeof continueOnErrors === "boolean" 
		|| (typeof continueOnErrors === "number" && (continueOnErrors === 0 || continueOnErrors === 1))){
			config.continueOnErrors = continueOnErrors;		
		}
	}

/*	console.log("retryCount "+retryCount)
	console.log("delayTime "+delayTime)
	console.log("ensureFullSuccess "+ensureFullSuccess)
	console.log("batchDelay "+batchDelay)
	console.log("continueOnErrors "+continueOnErrors)
	console.log(config);*/
	return config;
}

module.exports = getConfig