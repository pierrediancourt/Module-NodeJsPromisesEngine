const Q = require("q");
const fs = require("fs-extra");

var firstCall = true;
var callNumber = 0;

function failingOnFirstCall(){
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
			deferred.resolve("failingOnFirstCall");
		}	
	})
	firstCall = false;
	return deferred.promise;
}

function working1(){
	var deferred = Q.defer();
	fs.writeJson("./tests/bim", {name: 'demo'}, err => {
		if (err) {
			//console.error(err);
			deferred.reject(new Error(err));
		} else {
			//console.log('made file !')
			deferred.resolve("working1");
		}	
	})
	return deferred.promise;
}

function working2(){
	var deferred = Q.defer();
	fs.writeJson("./tests/bim", {name: 'demo'}, err => {
		if (err) {
			//console.error(err);
			deferred.reject(new Error(err));
		} else {
			//console.log('made file !')
			deferred.resolve("working2");
		}	
	})
	return deferred.promise;
}

function working3(){
	var deferred = Q.defer();
	fs.writeJson("./tests/bim", {name: 'demo'}, err => {
		if (err) {
			//console.error(err);
			deferred.reject(new Error(err));
		} else {
			//console.log('made file !')
			deferred.resolve("working3");
		}	
	})
	return deferred.promise;
}

function failing1(){
	var deferred = Q.defer();
	fs.writeJson("C:/bim", {name: 'demo'}, err => {
		if (err) {
			//console.error(err);
			deferred.reject(new Error(err));
		} else {
			//console.log('made file !')
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