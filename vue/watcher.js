class Vue {
	constructor(options) {
		this._init(options)
	}
	_init(options) {
		let data
		if (typeof options.data === 'function') {
			this._data = data = options.data() 
		} else {
			this._data = data = option.data
		}
		const keys = Object.keys(data)
		let i = keys.length
		while (i--) {
			proxy(this, `_data`, keys[i])
		}
		observe(data, true)
		this.$mount()
	}
	$mount() {
		// 在实例化vue的时候,会调用$mount进而调用mountComponent进而会调用new Watcher() 这一步非常关键
		let vm = this
		let updateComponent = () => {
			console.log('这里会调用vm._update提示数据变化,告诉vue该渲染了')
		}
		vm._watchers = []
		new Watcher(vm, updateComponent, function() {}, null, true/* isRenderWatcher*/)
	}
}
/******/
const sharedPropertyDefinition = {
	enumerable: true,
	configurable: true,
	get: function() {},
	set: function() {}
}
function proxy(target, sourceKey, key) {
	sharedPropertyDefinition.get = function proxyGetter() {
		console.log('get')
		return this[sourceKey][key]
	}
	sharedPropertyDefinition.set = function proxySetter(val) {
		console.log('set')
		this[sourceKey][key] = val
	}
	Object.defineProperty(target, key, sharedPropertyDefinition)
}
/********/
let wuid = 0
class Watcher {
	constructor(vm, expOrFn, cb, options, isRenderWatcher) {
		this.vm = vm
		if (isRenderWatcher) {
			vm._watcher = this
		}
		vm._watchers.push(this)
		if (options) {
			this.deep = !!options.deep
			this.user = !!options.user
			this.lazy = !!options.lazy
			this.sync = !!options.sync
		} else {
			this.deep = this.user = this.lazy = this.sync = false
		}
		this.cb = cb
		this.id = ++wuid
		this.active = true
		this.dirty = this.lazy
		this.deps = []
		this.newDeps = []
		this.depIds = new Set()
		this.newDepsIds = new Set()
		this.expression = expOrFn.toString()
		
		if (typeof expOrFn === 'function') {
			this.getter = expOrFn
		} else {
			this.getter = function() {} // todo
		}
		this.value = this.lazy ? undefined : this.get()
	}
	// 解析getter 并且重新收集依赖
	get() {
		pushTarget(this) // 这里Dep.target将不再是null
		let value
		const vm = this.vm
		try {
			value = this.getter.call(vm, vm)
			console.log(vm._data.c.ca)
			// 这里是个巨坑如果数据不使用,那么依赖就不会收集,也就是说数据变化的时候不会渲染,那么数据什么时候会用呢,在调用getter的时候会渲染模板,那个时候就是触发数据的getter
		} catch (e) {
		} finally {
			// 如果是深度依赖
			if (this.deep) {
				traverse(value)
			}
			popTarget()
			this.cleanupDeps()
		}
		return value
	}
	
	addDep(dep) {
		const id = dep.id
		if (!this.newDepsIds.has(id)) {
			this.newDepsIds.add(id)
			this.newDeps.push(dep)
			if (!this.depIds.has(id)) {
				dep.addSub(this)
			}
		}
	}
	
	cleanupDeps() {
		let i = this.deps.length
		while (i--) {
			const dep = this.deps[i]
			if (!this.newDepIds.has(dep.id)) {
				dep.removeSub(this)
			}
		}
		let tmp = this.depIds
		this.depIds = this.newDepIds
		this.newDepIds = tmp
		this.newDepIds.clear()
		tmp = this.deps
		this.deps = this.newDeps
		this.newDeps = tmp
		this.newDeps.length = 0
	}
	
	update() {
		console.log('update')
		if (this.lazy) {
			this.dirty = true
		} else if (this.sync) {
			this.run()
		} else {
			queueWatcher(this)
		}
	}
	
	run() {
		// todo
		console.log('run')
		if (this.active) {
			const value = this.get()
		}
	}
	
	evalute() {
		this.value = this.get()
		this.dirty = false
	}
	
	depend() {
		let i = this.deps.length
		while (i--) {
			this.deps[i].depend()
		}
	}
	
	teardown() {
		if (this.active) {
			if (!this.vm._isBeingDestoryed) {
				
			}
			let i = this.deps.length
			while (i--) {
				this.deps[i].removeSub(this)
			}
			this.active = false
		}
	}
}
let has = {}
let flushing = false
let index = 0
let waiting = false
let queue = []
function queueWatcher(watcher) {
	const id = watcher.id
	if (has[id] == null) {
		has[id] = true //防止数据乱变化,造成短时间多次更新
		if (!flushing) {
			queue.push(watcher)
		} else {
			let i = queue.length - 1
			while (i > index && queue[i].id > watcher.id) {
				i--
			}
			queue.splice(i + 1, 0, watcher)
		}
		if (!waiting) {
			waiting = true
			nextTick(flushSchedulerQueue)
		}
	}
}
const callbacks = []
let pending = false
function nextTick(cb, ctx) {
	let _resolve
	callbacks.push(() => {
		if (cb) {
			try {
				cb.call(ctx)
			} catch (e) {
				
			}
		} else if (_resolve) {
			_resolve(ctx)
		}
	})
	if (!pending) {
		pending = true
		/*
		if (useMacroTask) {
			macroTimerFunc()
		} else {
			microTimerFunc()
		}
		*/
		// 简化版, 上面可以看出尤大对性能的追求,使用了宏任务与微任务,对性能的理解
		// flushCallbacks
		setTimeout(() => {
			pending = false
			const copies = callbacks.splice(0)
			callbacks.length = 0
			for (let i = 0; i < copies.length; i++) {
				copies[i]()
			}
		}, 0)
	}
	
	if (!cb && typeof Promise !== 'undefined') {
		return new Promise(resolve => {
			_resolve = resolve
		})
	}
}
const activatedChildren = [] //子组件相关
function flushSchedulerQueue() {
	flushing = true
	let watcher, id
	queue.sort((a, b) => a.id - b.id)
	
	for (index = 0; index < queue.length; index++) {
		watcher = queue[index]
		id = watcher.id
		has[id] = null
		watcher.run()
		// 在线上版本中,为了防止意外出现循环更新,这里还需要做处理
	}
	
	const activatedQueue = activatedChildren.slice()
	const updatedQueue = queue.slice()
	resetSchedulerState()
	
	// 下面还会触发两个钩子,钩子省略,这两个钩子主要是在组件哪部进行通知或者更新的
	// todo
}

function resetSchedulerState() {
	index = queue.length = activatedChildren.length = 0
	has = {}
	waiting = flushing = false
}

function traverse() {
	
}
/*******/
let uid = 0
class Dep {
	
	constructor () {
		this.id = uid++
		this.subs = []
	}
	
	addSub(sub) {
		this.subs.push(sub)
	}
	
	removeSub(sub) {
		
	}
	
	depend() {
		if (Dep.target) {
			Dep.target.addDep(this)
		}
	}
	
	notify() {
		const subs = this.subs.slice()
		for (let i = 0; i < subs.length; i++) {
			subs[i].update()
		}
	}
}
Dep.target = null
const targetStack = []
function pushTarget(_target) {
	if (Dep.target) targetStack.push(Dep.target)
	Dep.target = _target
}
function popTarget() {
	Dep.target = targetStack.pop()
}

function dependArray(value){
	for (let e,i = 0; i < value.length; i++) {
		e = value[i]
		e && e.__ob__ && e.__ob__.dep.depend()
		if (Array.isArray(e)) {
			dependArray(e)
		}
	}
}
/*******/

/******/
function def(obj, key, val, enumerable) {
	Object.defineProperty(obj, key, {
		value: val,
		enumerable: !!enumerable,
		writable: true,
		configurable: true
	})
}
function defineReactive(obj, key, val, customSetter, shallow) {
	const dep = new Dep()
	
	const property = Object.getOwnPropertyDescriptor(obj, key)
	if (property && property.configurable === false) {
		return
	}
	const getter = property && property.get
	const setter = property && property.set
	
	let childOb = !shallow && observe(val)
	
	Object.defineProperty(obj, key, {
		enumerable: true,
		configurable: true,
		get: function reactiveGetter() {
			const value = getter ? getter.call(obj) : val
			if (Dep.target) {
				console.log('get操作')
				dep.depend()
				if (childOb) {
					childOb.dep.depend()
					if (Array.isArray(value)) {
						dependArray(value)
					}
				}
			}
			return value
		},
		set: function reactiveSetter (newVal) {
			const value = getter ? getter.call(obj) : val
			if (newVal === value || (newVal !== newVal && value !== value)) {
				return //Nan !== Nan
			}
			
			if (customSetter) {
				customSetter()
			}
			
			if (setter) {
				setter.call(obj, newVal)
			} else {
				val = newVal // 对象自己没有setter方法
			}
			childOb = !shallow && observe(newVal)
			dep.notify()
		}
	})
}

class Observer {
	constructor(value) {
		this.value = value
		this.dep = new Dep()
		this.vmCount = 0
		def(value, '__ob__', this)
		if (Array.isArray(value)) {
			value.__proto__ = Object.create(Array.prototype) // 对数组方法的代理先省略
			this.observeArray(value)
		} else {
			this.walk(value)
		}
	}
	walk (obj) {
		const keys = Object.keys(obj)
		for (let i = 0; i < keys.length; i++) {
			defineReactive(obj, keys[i], obj[keys[i]])
		}
	}
	observeArray (items) {
		for (let i = 0; i < items.length; i++) {
			observe(items[i])
		}
	}
}
function observe(value, asRootData) {
	let ob
	if (value.hasOwnProperty('__ob__') && value.__ob__ instanceof Observer) {
		ob = value.__ob__
	} else if (
		/*省略一系列判断条件*/
		Array.isArray(value) || Object.prototype.toString.call(value) === '[object Object]'
	) {
		ob = new Observer(value)
	}
	if (asRootData && ob) {
		ob.vmCount++
	}
	return ob
}




const el = new Vue({
	data() {
		return {
			a: 1,
			b: 'string',
			c: {
				ca: 1,
				cb: 'string'
			},
			d: [1, 2, 3, 4]
		}
	}
})

//el._watcher.depend()
setTimeout(() => {
	el.c.ca = 2
}, 1000)

