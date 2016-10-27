import which from '@raider/which'

export default function shouldUseYarn ({ yarn, npm } = {}, cb) {
  if(yarn && npm)
    throw new Error('you must choose between yarn or npm or let the best choice be autodetected.')
  if(npm)
    cb(false)
  else if(yarn)
    cb(true)
  else
    which('yarn', cb)
}
