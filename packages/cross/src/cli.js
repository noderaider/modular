import chalk from 'chalk'
import yargs from 'yargs'
import util from 'util'
import { api } from '../'
import prompt from 'cli-prompt'

export default function cli (cb = (result) => {
  if(result instanceof Error) {
    console.error(`error occurred during execution => ${util.inspect(result)}`)
    process.exit(1)
  } else if(result === false) {
    process.exit(1)
  }
  if(result)
    console.log(result)
}) {
  const packageJson = require('../package.json')
  const name = packageJson.name.includes('/') ? packageJson.name.split('/')[1] : packageJson.name
  const argv = yargs
    .usage(chalk.green.bold(`Usage: ${name} [repo/path] [options]`))
    .version(packageJson.version)
    .describe('verbose', 'Print debugging information.')
    .help('h')
    .alias('h', 'help')
    .argv
  const { _, ...opts } = argv
  const [ _path = process.cwd() ] = _
  prompt( `${packageJson.name} will upgrade ${chalk.cyan(_path)} recursively => proceed? [${chalk.green('y')}${chalk.red('N')}]`
  , (val) => {
      if(val === 'y') {
        api([ _path ], opts, cb)
      } else {
        console.log('\u270C')
        process.exit(0)
      }
    }
  , (err) => {
      console.error(err)
      process.exit(1)
    }
  )
}
