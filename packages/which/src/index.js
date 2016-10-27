import yargs from 'yargs'
import chalk from 'chalk'
import spawn from 'cross-spawn'
import os from 'os'
import { Transform } from 'stream'

export function api (args, opts, cb) {
  if(args.length !== 1)
    throw new Error('which requires exactly 1 argument name (and a callback for api)')
  const [ name ] = args
  return which(name, cb)
}

export default function which(name, cb) {
  if(cb) {
    _which(name, cb)
  } else {
    return new Promise((resolve, reject) => {
      _which(name, (result) => {
        if(result instanceof Error)
          return reject(result)
        resolve(result)
      })
    })
  }
}

function _which (name, cb) {
  try {
    if(!name)
      throw new Error('which requires a name argument')
    const isWin = os.platform() === 'win32'
    const child = spawn (
      isWin ? 'where' : 'whereis'
    , [ name ]
    , { encoding: 'utf8' }
    )
    let output = ''
    let pipe = child.stdout.pipe(new FirstLineStream())
    let chunks = []
    const timeoutMS = 5000
    const timeoutID = setTimeout(() => cb(new Error(`which timed out after ${timeoutMS}`)), timeoutMS)
    pipe.on('data', (chunk) => {
      if(chunk) output += chunk
    })
    pipe.on('end', () => {
      clearTimeout(timeoutID)
      cb(output.length > 0 ? output : false)
    })
  } catch(err) {
    cb(err)
  }
}

class FirstLineStream extends Transform {
  constructor() {
    super({})
    this.isFinished = false
  }
  _transform(chunk, encoding, next) {
    if(this.isFinished)
      return next()
    const str = chunk.toString('utf8')
    if(str.includes('\n')) {
      const [ final ] = str.split('\n')
      this.push(final)
      this.isFinished = true
    } else {
      this.push(str)
    }
    next()
  }
}
