import * as lerna from 'lerna'
import util from 'util'
const { __commands__ } = lerna

export default function createReactRepo (path) {
  if(typeof path !== 'string')
    return Promise.reject(new Error('createReactRepo must be passed a string path.'))
  return new Promise((resolve, reject) => {
    const command = new __commands__.init(path)
    console.info(`INIT COMMAND => ${util.inspect(command)}`)
    const result = command.run()
    console.info(`INIT RESULT => ${util.inspect(result)}\n\ttypeof(${typeof result})\n\tinstanceof Promise(${result instanceof Promise})`)
    return resolve(result)
  })
}
