export default function lock(target, name, descriptor) {
  const method = descriptor.value;
  const unlock = () => method.__locked = false;
	descriptor.value = function() {
    let promise;
    if (method.__locked) {
      const warn = `${name} is locked`;
      if (typeof CC_DEBUG !== 'undefined') {
        console.warn(warn);
      }
      return Promise.resolve(warn);
    } else {
      method.__locked = true;
      promise = method.apply(this, arguments);
      if (promise instanceof Promise) {
        promise.then(unlock, unlock);
      } else {
        unlock();
      }
      return promise;
    }
	};
	return descriptor;
};