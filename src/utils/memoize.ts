export function memoize(func: Function) {
	const cache = new Map();

	return function (...args) {
		// Get the JSON string of the args
		const key = JSON.stringify(args);

		// Check if this value has been cached and return it if found
		if (cache.has(key)) {
			return cache.get(key);
		}

		// Otherwise run function and get the result to cache
		const result = func.apply(this, args);
		cache.set(key, result);

		return result;
	};
}