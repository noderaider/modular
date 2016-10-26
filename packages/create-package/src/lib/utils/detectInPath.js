import spawn from 'cross-spawn'

export default function detectInPath(name, cb) {
  try {
    const isWin = require('os').platform() === 'win32'
    spawn(
      isWin ? 'where' : 'whereis'
    , isWin ? [ '/Q', name ] : [ name ]
    , { stdio: 'inherit', encoding: 'utf8' }
    ).on('close', (code) => cb(code === 0))
  } catch(err) {
    cb(false)
  }
}
