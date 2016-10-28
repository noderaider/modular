import chalk from 'chalk'
import yargs from 'yargs'
import util from 'util'
import { api } from '../'

export default function cli (cb = (result) => {
  if(result instanceof Error) {
    console.error(`error occurred during execution => ${util.inspect(result)}`)
    process.exit(1)
  } else if(result === false || result.length === 0) {
    process.exit(1)
  }
  console.log(result)
}) {
  const packageJson = require('../package.json')
  const name = packageJson.name.includes('/') ? packageJson.name.split('/')[1] : packageJson.name
  const argv = yargs
    .usage(chalk.green.bold(`Usage: ${name} <executable> [options]`))
    .version(packageJson.version)
    .describe('verbose', 'Print debugging information.')
    .help('h')
    .alias('h', 'help')
    .demand(1)
    .argv
  const { _, ...opts } = argv
  return api(_, opts, cb)
}
