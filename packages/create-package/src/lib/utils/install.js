import spawn from 'cross-spawn'
import util from 'util'

function installFail(code, ...args) {
  console.error(`--npm install failed with ${code}--\n${args.join('\n')}`)
  process.exit(1)
}

function fallback(verbose, cb) {
  console.warn('Error during yarn install, falling back to npm...')
  install(false, { message: `${chalk.bold.yellow('--yarn error occurred--')} | installing bin-utils with npm (fallback)`, verbose }, cb)
}

export default function install(useYarn, { message, verbose } = {}, cb) {
  try {
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
          fallback(verbose, cb)
        } else {
          installFail(code, ...args)
        }
      } else {
        cb()
      }
    })
  } catch(err) {
    if(useYarn) {
      fallback(verbose, cb)
    } else {
      installFail(1, util.inspect(err))
    }
  }
}
