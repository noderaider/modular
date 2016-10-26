import spawn from 'cross-spawn'
import util from 'util'

function installFail(code, ...args) {
  console.error(`npm install failed with ${code}:\n${args.join('\n')}`)
  process.exit(1)
}

export default function install(useYarn, message, cb) {
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
          console.warn('Error during yarn install, falling back to npm...')
          install(false, `${chalk.bold.yellow('--yarn error occurred--')} | installing bin-utils with npm (fallback)`, cb)
        } else {
          installFail(code, ...args)
        }
      } else {
        cb()
      }
    })
  } catch(err) {
    installFail(1, util.inspect(err))
  }
}
