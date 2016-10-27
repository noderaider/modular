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
  if(!name)
    throw new Error('which requires a name argument')
  try {
    const isWin = os.platform() === 'win32'
    const child = spawn (
      isWin ? 'where' : 'whereis'
    , isWin ? [ name ] : [ name ]
    , { encoding: 'utf8' }
    )
    let output = ''
    let filtered = child.stdout.pipe(new FirstLineStream())
    let chunks = []
    filtered.on('data', (chunk) => {
      if(chunk) chunks.push(chunk)
    })
    filtered.on('end', () => {
      const result = chunks.join('')
      cb(result)
    })
  } catch(err) {
    cb(false)
  }
}

class FirstLineStream extends Transform {
  constructor() {
    super({})
    this.isFinished = false
  }
  _transform(chunk, encoding, next) {
    if(this.isFinished)
      next()
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
