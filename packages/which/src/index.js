import yargs from 'yargs'
import chalk from 'chalk'
import spawn from 'cross-spawn'

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
    const isWin = require('os').platform() === 'win32'
    spawn(
      isWin ? 'where' : 'whereis'
    , isWin ? [ name ] : [ name ]
    , { stdio: 'inherit', encoding: 'utf8' }
    ).on('close', (code) => cb(code === 0))
  } catch(err) {
    cb(false)
  }
}
