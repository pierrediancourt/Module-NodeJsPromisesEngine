const Q = require("q");
const should = require("chai").should();
const assert = require("chai").assert;
const expect = require("chai").expect;
const promisesEngine = require("../index");
const action = require("./actions");
const Action = require("../action");

describe("Testing of the public functions of the promisesEngine", function() {
	this.timeout(5000); //configuring mocha test so that they can resolve in 5 sec max instead of 2 sec by default
	this.slow(20); //configuring mocha test so that it's considered slow if above 20 ms duration to complete instead of 1 sec by default 

	describe("Tests actions without params", function() {
		it("Makes a batch of actions [pack of 2, no delay, no retry]", function() {
			var actions = [new Action(action.working3), new Action(action.working1), new Action(action.working2)];
			
			var promiseResult = promisesEngine.batch(actions, 2, true, 0, 0, false, 0);
			Q.isPromise(promiseResult).should.equal(true);
			return promiseResult.then(function(results){
				//console.log("results : "+results);
				results.should.be.an('array');
				results.length.should.equal(3);
				results[0].should.equal('working3');
				results[1].should.equal('working1');
				results[2].should.equal('working2');
			});
		});

		it("Makes a batch of actions [pack of 1, no delay, retry]", function() {
			var actions = [new Action(action.working3), new Action(action.failingOnFirstCall)];

			var promiseResult = promisesEngine.batch(actions, 1, true, 1, 0, true, 0);
			Q.isPromise(promiseResult).should.equal(true);
			return promiseResult.then(function(results){
				//console.log("results : "+results);
				results.should.be.an('array');
				results.length.should.equal(2);
				results[0].should.equal('working3');
				results[1].should.equal('failingOnFirstCall');
			});
		});

		it("Makes a batch of actions with retry [pack of 2, no delay, retry]", function() {
			var actions = [new Action(action.working3), new Action(action.failingOnFirstCall)];

			var promiseResult = promisesEngine.batch(actions, 2, true, 1, 0, true, 0);
			Q.isPromise(promiseResult).should.equal(true);
			return promiseResult.then(function(results){
				//console.log("results : "+results);
				results.should.be.an('array');
				results.length.should.equal(2);
				results[0].should.equal('working3');
				results[1].should.equal('failingOnFirstCall');
			});
		});

		it("Makes a chain of actions", function(){
			var actions = [new Action(action.working3), new Action(action.working1), new Action(action.working2)];

			var promiseResult = promisesEngine.chain(actions);
			Q.isPromise(promiseResult).should.equal(true);
			return promiseResult.then(function(result){
				//console.log("result : "+result);
				result.should.equal("working2");
			});
		});

		it("Does retry an action", function(){
			var promiseResult = promisesEngine.retry(new Action(action.failingOnFirstCall));
			Q.isPromise(promiseResult).should.equal(true);
			return promiseResult.then(function(result){
				//console.log("result : "+result);
				result.should.equal("failingOnFirstCall");
			});
		});

		it("Does run in parallel actions", function(){
			var actions = [new Action(action.working3), new Action(action.failingOnFirstCall), new Action(action.working1)];

			var promiseResult = promisesEngine.parallelize(actions, true, 1, 0, true);
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
	});
	describe("Tests actions without params", function() {
		it("Makes a batch of actions [pack of 2, no delay, no retry]", function() {
			var actions = [new Action(action.working3, ["plop","plip"]), new Action(action.working1, ["plop"]), new Action(action.working2, ["plop"])];

			var promiseResult = promisesEngine.batch(actions, 2, true, 0, 0, false, 0);
			Q.isPromise(promiseResult).should.equal(true);
			return promiseResult.then(function(results){
				//console.log("results : "+results);
				results.should.be.an('array');
				results.length.should.equal(3);
				results[0].should.equal('working3');
				results[1].should.equal('working1');
				results[2].should.equal('working2');
			});
		});
	
	});
//failingOnFirstCall().then(failingOnFirstCall());
//setTimeout(function(){failingOnFirstCall()}, 5000);
});




