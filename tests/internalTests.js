const Q = require("q");
const should = require("chai").should();
const assert = require("chai").assert;
const expect = require("chai").expect;
const retry = require("../retry");
const getConfig = require("../config");
const action = require("./actions");
const Action = require("../action");

describe("Testing of the internal functions of the promisesEngine", function() {
  this.timeout(5000); //configuring mocha test so that they can resolve in 5 sec max instead of 2 sec by default
  this.slow(20); //configuring mocha test so that it's considered slow if above 20 ms duration to complete instead of 1 sec by default 

  it("Does retry all actions [with retry]", function(){
	var actions = [action.working3, action.failingOnFirstCall, action.working1];
	var params = [];

	var config = getConfig(1, 0, true);
  	var promiseResult = retry.runRetryAll(actions, params, config);
  	Q.isPromise(promiseResult).should.equal(true);
	return promiseResult.then(function(results){
		//console.log("results : "+results);
		results.should.be.an('array');
		results.length.should.equal(3);
		results[0].should.equal("working3");
		results[1].should.equal("failingOnFirstCall");
		results[2].should.equal("working1");		
	});
  });

  it("Does retry all actions [without retry]", function(){
	var actions = [action.working3, action.working2, action.working1];
	var params = [];

	var config = getConfig(1, 0, true);
  	var promiseResult = retry.runRetryAll(actions, params, config);
  	Q.isPromise(promiseResult).should.equal(true);
	return promiseResult.then(function(results){
		//console.log("results : "+results);
		results.should.be.an('array');
		results.length.should.equal(3);
		results[0].should.equal("working3");
		results[1].should.equal("working2");
		results[2].should.equal("working1");		
	});
  });

});