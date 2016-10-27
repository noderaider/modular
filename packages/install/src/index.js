import chalk from 'chalk'
import spawn from 'cross-spawn'
import util from 'util'
import shouldUseYarn from './utils/shouldUseYarn'

export function api (args, argv, cb) {
  install (argv, cb)
}

export default function install(opts, cb) {
  if(cb) {
    _install(opts, cb)
  } else {
    return new Promise((resolve, reject) => {
      _install(opts, (result) => {
        if(result instanceof Error)
          return reject(result)
        resolve()
      })
    })
  }
}

const YARN_ERROR_FALLBACK = `${chalk.bold.red('--yarn error occurred--')} | installing bin-utils with npm (fallback)`
const YARN_AUTODETECT_MESSAGE = `${chalk.bold.green('--yarn detected--')} | installing at velocity c`
const NPM_AUTODETECT_MESSAGE = `${chalk.bold.yellow('--yarn not detected--')} | installing at standard velocity (${chalk.cyan('npm i -g yarn')} to go fast)`
const YARN_INSTALL_MESSAGE = `${chalk.bold.blue('--yarn install--')} | installing...`
const NPM_INSTALL_MESSAGE = `${chalk.bold.blue('--npm install--')} | installing...`

function _install({ yarn = false
                  , npm = false
                  , yarnInstallMessage = YARN_INSTALL_MESSAGE
                  , npmInstallMessage = NPM_INSTALL_MESSAGE
                  , yarnAutodetectMessage = YARN_AUTODETECT_MESSAGE
                  , npmAutodetectMessage = NPM_AUTODETECT_MESSAGE
                  , verbose = false
                  } = {}, cb) {
  const opts = { yarn, npm, yarnInstallMessage, npmInstallMessage, yarnAutodetectMessage, npmAutodetectMessage, verbose }
  shouldUseYarn({ yarn, npm }, (useYarn) => {
    try {
      const autodetect = !yarn && !npm
      const message = autodetect ? (useYarn ? yarnAutodetectMessage : npmAutodetectMessage) : (useYarn ? yarnInstallMessage : npmInstallMessage)
      console.log(message)
      const executable = useYarn ? 'yarn' : 'npm'
      const args = (useYarn ? [] : [ 'install', verbose ? '--verbose' : '--silent' ]).filter((e) => { return e })

      spawn(
        executable
      , args
      , { stdio: 'inherit' }
      ).on('close', (code, ...args) => {
        if (code !== 0) {
          if(useYarn) {
            fallback(opts, cb)
          } else {
            installFail(code, ...args)
          }
        } else {
          cb()
        }
      })
    } catch(err) {
      if(useYarn) {
        fallback(opts, cb)
      } else {
        installFail(1, util.inspect(err))
      }
    }
  })
}

function installFail(code, ...args) {
  console.error(`--npm install failed with ${code}--\n${args.join('\n')}`)
  process.exit(1)
}


function fallback(opts, cb) {
  console.warn('Error during yarn install, falling back to npm...')
  install({ ...opts, npm: true, npmInstallMessage: YARN_ERROR_FALLBACK }, cb)
}
