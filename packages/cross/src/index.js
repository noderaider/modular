import yargs from 'yargs'
import chalk from 'chalk'
import { dos2unix } from 'dos2unix'
import invariant from 'invariant'

export function api (args, opts, cb) {
  const [ path ] = args
  return cross(path, cb)
}

export default function cross(path = process.cwd(), cb) {
  if(cb) {
    _cross(path, cb)
  } else {
    return new Promise((resolve, reject) => {
      _cross(path, (result) => {
        if(result instanceof Error)
          return reject(result)
        resolve(result)
      })
    })
  }
}

function _cross (path, cb) {
  try {
    // Create a new `dos2unix` instance and add important event listeners
    const d2u = new dos2unix({  glob: { cwd: path }, maxConcurrency: 50 })
      .on('error', (err) => {
        cb(err)
      })
      .on('end', (stats) => {
        console.log(stats)
        cb()
      })
    d2u.process([ '**/*' ])
  } catch(err) {
    cb(err)
  }
}
