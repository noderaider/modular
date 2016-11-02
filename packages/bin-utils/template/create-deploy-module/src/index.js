import yargs from 'yargs'
import chalk from 'chalk'

const packageJson = require('package.json')

export function api (args, opts, cb) {
  if(args.length !== 1)
    throw new Error(`${packageJson.name} requires exactly 1 command argument`)
  const [ arg ] = args
  return execute(arg, cb)
}

export default function execute(arg, cb) {
  if(cb) {
    _execute(arg, cb)
  } else {
    return new Promise((resolve, reject) => {
      _which(name, (result, ...rest) => {
        if(result instanceof Error)
          return reject(result)
        resolve(result, ...rest)
      })
    })
  }
}

function _execute (arg, cb) {
  try {
    console.log(`executing ${packageJson.name} with arg ${arg}`)
    cb()
  } catch(err) {
    cb(err)
  }
}
