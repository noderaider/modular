import spawn from 'cross-spawn'

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
        console.error(`${executable} ${args.join(' ')} failed with ${code}:\n${args.join('\n')}`)
        process.exit(1)
      }
      cb()
    })
  } catch(err) {
    cb(err)
  }
}
