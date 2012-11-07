if(!window) var window = global
;(function(vexi){
	var Queue = vexi.Queue = (function(){
		var queue = function(){
			var that = this
			
			this.itemsQueue = []
			this._lock
			this.execute = function(){
				if(this._lock){
					return
				}
				var item = this.itemsQueue.splice(0,1)[0]
				if(item){
					this._lock = true
					item.fn.call(item.context, that.done)
				}
			}
			this.done = function(){
				that._lock = false
				that.execute()
			}
			
			return {
				add: function(fn, settings){
					var item =
						{ fn: fn
						, context: settings && settings.context ? settings.context : this
						}
					that.itemsQueue.push(item)
					if(settings && typeof settings.index === "number") {
						this.changeIndex(fn, settings.index)
					}
				},
				remove: function(fn){
					var i = this.inQueue(fn)
						, queue = that.itemsQueue
					if(i<0){
						return false
					}
					queue.splice(i,1)
					return true
				},
				execute: function(){
					that.execute() 
				},
				inQueue: function(fn){
					var queue = that.itemsQueue
						, i = queue.length
					while(i--){
						if(queue[i].fn === fn){
							return i
							break
						}
					}
					return -1
				},
				changeIndex: function(fn, newIndex){
					var queue = that.itemsQueue
						, oldIndex = this.inQueue(fn)
					if(oldIndex){
						queue.splice(newIndex, 0, queue.splice(oldIndex, 1)[0])
						return true
					} else {
						return false
					}
				}
			}
		}
	return queue
	}())
}(window.vexi = window.vexi || {}))