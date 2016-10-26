import yargs from 'yargs'
import chalk from 'chalk'

export default function api (commands, opts) {
  const packageJson = require('../package.json')
  if (!commands && !opts) {
    const argv = yargs
      .usage(`Usage: ${packageJson.name} <project-directory> [options]\nversion: ${packageJson.version}`)
      .describe('verbose', 'Print debugging information.')
      .help('h')
      .alias('h', 'help')
      .demand(1)
      .argv
    const { _, ..._opts } = argv
    commands = _
    opts = _opts
  }
  return execute(commands, opts, packageJson)
}

function execute (commands, opts, packageJson) {
  console.log(`${chalk.green(`--${packageJson.name} executing--`)} ADD CODE HERE`)
}
