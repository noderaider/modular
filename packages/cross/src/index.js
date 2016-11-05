import yargs from 'yargs'
import chalk from 'chalk'
import { dos2unix } from 'dos2unix'

export function api (args, opts, cb) {
  return cross(cb)
}

export default function cross(cb) {
  if(cb) {
    _cross(cb)
  } else {
    return new Promise((resolve, reject) => {
      _cross((result) => {
        if(result instanceof Error)
          return reject(result)
        resolve(result)
      })
    })
  }
}

function _cross (cb) {
  try {
    const D2UConverter = dos2unix()
    const defaultOptions = {  glob: { cwd: __dirname }, maxConcurrency: 50 }

    // Create a new `dos2unix` instance and add important event listeners
    const d2u = new D2UConverter(defaultOptions)
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
