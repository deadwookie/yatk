export function autobind(target: any, key: string, descriptor: any) {
	let fn: Function = descriptor.value

	if (typeof fn !== 'function') {
		throw new Error(`@autobind decorator can only be applied to methods not: ${typeof fn}`)
	}

	return {
		configurable: true,
		get(this: any) {
			if (this === target.prototype) {
				return fn
			}

			const boundFn = fn.bind(this)
			Object.defineProperty(this, key, {
				value: boundFn,
				configurable: true,
				writable: true
			})
			return boundFn
		}
	}
}


export function throttle(ms: number): MethodDecorator {
	return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
		const original: Function = descriptor.value
		descriptor.value = _throttle(original, ms)
		return descriptor
	}
}

// via https://javascript.info/task/throttle
export function _throttle(func: Function, ms: number) {

	let isThrottled = false,
		savedArgs: IArguments | null,
		savedThis: any

	function wrapper(this: any) {

		if (isThrottled) {
			savedArgs = arguments
			savedThis = this
			return
		}

		func.apply(this, arguments)

		isThrottled = true

		setTimeout(function () {
			isThrottled = false
			if (savedArgs) {
				wrapper.apply(savedThis, savedArgs)
				savedArgs = savedThis = null
			}
		}, ms)
	}

	return wrapper
}
