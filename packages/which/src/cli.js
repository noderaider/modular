import yargs from 'yargs'
import util from 'util'
import { api } from '../'

export default function cli (cb = (err) => {
  if(!err)
    return
  console.error(`error occurred during execution => ${util.inspect(err)}`)
  process.exit(1)
}) {
  const packageJson = require('../package.json')
  const argv = yargs
    .usage(`Usage: ${packageJson.name} <project-directory> [options]\nversion: ${packageJson.version}`)
    .describe('verbose', 'Print debugging information.')
    .help('h')
    .alias('h', 'help')
    .demand(1)
    .argv
  const { _, ..._opts } = argv
  args = _
  opts = _opts
  return api(args, opts, cb)
}
