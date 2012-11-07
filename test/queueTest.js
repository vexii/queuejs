require("./../queue.js")
var should = require("chai").should()

describe("Queue",function(){
	var queue 
	beforeEach(function(){
		queue = new vexi.Queue()
	})
	describe("add(fn, settings)",function(){
		it("should add a function to the queue", function(){
			var queueFunction = function(done){ done() }
			queue.add(queueFunction)
			queue.inQueue(queueFunction).should.equal(0)
		})
		it("should keep the context for the function", function(){
			var queueFunction = function(){
				this.foo.should.equal("bar")
			}
			var queueContext = {
				foo: "bar"
			}
			queue.add(queueFunction, {context: queueContext})
			queue.execute()
		})
		it("always inserts functions at the right index", function(){
			var emptyFunction = function emptyFunction(){}
			var queueFunction = function queueFunction(){}
			
			queue.add(emptyFunction)
			queue.add(queueFunction, {index: 0})
			
			queue.inQueue(queueFunction).should.equal(0)
			queue.inQueue(emptyFunction).should.equal(1)
		})
	})
	describe("remove(fn)", function(){
		it("can remove functions from the queue", function(){
			var queueFunction = function(){}
			
			queue.add(queueFunction)
			queue.remove(queueFunction)
			queue.inQueue(queueFunction).should.equal(-1)
		})
		it("returns true on sucess",function(){
			var queueFunction = function(){}
			
			queue.add(queueFunction)
			queue.remove(queueFunction).should.equal(true)
		})
	})
	describe("execute(fn)",function(){
		beforeEach(function(){

			var contextObject = {
				i: 0,
				fn: function(){ return this.i += 1 }
			}
			queue.execute()
			var firstQueueFunction = function(done){
				this.fn().should.equal(1)
				done()
			}
			var secondQueueFunction = function(done){
				this.fn().should.equal(2)
				done()
			}
			var thirdQueueFunction = function(done){
				this.fn().should.equal(3)
				done()
			}
			queue.add(firstQueueFunction, {context: contextObject})
			queue.add(secondQueueFunction, {context: contextObject})
			queue.add(thirdQueueFunction, {context: contextObject})
		})
		it("should run the queue in order", function(){
			queue.execute()
		})
	})
})