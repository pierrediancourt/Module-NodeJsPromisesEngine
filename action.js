function Action(func, params = null) {
	// always initialize all instance properties
	if(typeof func !== "function"){
		console.error("This constructor requires a function as first parameter");
		return new Error("This constructor requires a function as first parameter");
	}

	this.ensureSuccess = true; //public
	this._params = params; //private by convention, not really private in fact
	this._function = func;
}

Action.prototype.getParams = function() {
	if(this._params === null){
		return [];
	}
	return this._params;
};

//public method
Action.prototype.getFunction = function() {
	return this._function;
};


/*function privateMethod () {
    return this._foo;
}*/

module.exports = Action;