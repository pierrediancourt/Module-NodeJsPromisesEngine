const Q = require("q");
const fs = require("fs-extra");

var firstCall = true;
var callNumber = 0;

function failingOnFirstCall(param1, param2){
	var deferred = Q.defer();
	callNumber++;
	//console.log("call number "+callNumber);
	var path = "C:/bim";
	if(!firstCall){
		//console.log("this is not the first call");
		path = "./tests/bim";
	}
	fs.writeJson(path, {name: 'demo'}, err => {
		if (err) {
			//console.error(err);
			deferred.reject(new Error(err));
		} else {
			//console.log('made file !')
			if(typeof param1 !== "undefined" 
			&& typeof param2 !== "undefined"){
				deferred.resolve("failingOnFirstCall with params 1&2");
			}
			if(typeof param1 !== "undefined"
			&& typeof param2 === "undefined"){
				deferred.resolve("failingOnFirstCall with param 1");
			}
			if(typeof param1 === "undefined"
			&& typeof param2 !== "undefined"){
				deferred.resolve("failingOnFirstCall with param 2");
			}
			deferred.resolve("failingOnFirstCall");
		}	
	})
	firstCall = false;
	return deferred.promise;
}

function working1(param1, param2){
	var deferred = Q.defer();
	fs.writeJson("./tests/bim", {name: 'demo'}, err => {
		if (err) {
			//console.error(err);
			deferred.reject(new Error(err));
		} else {
			//console.log('made file !')
			if(typeof param1 !== "undefined" 
			&& typeof param2 !== "undefined"){
				deferred.resolve("working1 with params 1&2");
			}
			if(typeof param1 !== "undefined"
			&& typeof param2 === "undefined"){
				deferred.resolve("working1 with param 1");
			}
			if(typeof param1 === "undefined"
			&& typeof param2 !== "undefined"){
				deferred.resolve("working1 with param 2");
			}
			deferred.resolve("working1");
		}	
	})
	return deferred.promise;
}

function working2(param1, param2){
	var deferred = Q.defer();
	fs.writeJson("./tests/bim", {name: 'demo'}, err => {
		if (err) {
			//console.error(err);
			deferred.reject(new Error(err));
		} else {
			//console.log('made file !')
			if(typeof param1 !== "undefined" 
			&& typeof param2 !== "undefined"){
				deferred.resolve("working2 with params 1&2");
			}
			if(typeof param1 !== "undefined"
			&& typeof param2 === "undefined"){
				deferred.resolve("working2 with param 1");
			}
			if(typeof param1 === "undefined"
			&& typeof param2 !== "undefined"){
				deferred.resolve("working2 with param 2");
			}
			deferred.resolve("working2");
		}	
	})
	return deferred.promise;
}

function working3(param1, param2){
	var deferred = Q.defer();
	fs.writeJson("./tests/bim", {name: 'demo'}, err => {
		if (err) {
			//console.error(err);
			deferred.reject(new Error(err));
		} else {
			//console.log('made file !')
			if(typeof param1 !== "undefined" 
			&& typeof param2 !== "undefined"){
				deferred.resolve("working3 with params 1&2");
			}
			if(typeof param1 !== "undefined"
			&& typeof param2 === "undefined"){
				deferred.resolve("working3 with param 1");
			}
			if(typeof param1 === "undefined"
			&& typeof param2 !== "undefined"){
				deferred.resolve("working3 with param 2");
			}
			deferred.resolve("working3");
		}	
	})
	return deferred.promise;
}

function failing1(param1, param2){
	var deferred = Q.defer();
	fs.writeJson("C:/bim", {name: 'demo'}, err => {
		if (err) {
			//console.error(err);
			deferred.reject(new Error(err));
		} else {
			//console.log('made file !')
			if(typeof param1 !== "undefined" 
			&& typeof param2 !== "undefined"){
				deferred.resolve("failing1 with params 1&2");
			}
			if(typeof param1 !== "undefined"
			&& typeof param2 === "undefined"){
				deferred.resolve("failing1 with param 1");
			}
			if(typeof param1 === "undefined"
			&& typeof param2 !== "undefined"){
				deferred.resolve("failing1 with param 2");
			}
			deferred.resolve("failing1");
		}	
	})
	return deferred.promise;
}


module.exports = {
	failingOnFirstCall : failingOnFirstCall,
	failing1 : failing1,
	working1 : working1,
	working2 : working2,
	working3 : working3
}