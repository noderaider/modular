export default function promisify (fn) {
  const promisified = (...args) => new Promise((resolve, reject) => {
    try {
      fn(...args, (...results) => {
        if(results[0] instanceof Error)
          reject(results[0])
        else
          resolve(...results)
      })
    } catch(err) {
      reject(err)
    }
  })
  return function promiseWrap (...args) {
    return (
      typeof args[args.length - 1] === 'function'
      ? fn(...args)
      : promisified(...args)
    )
  }
}
