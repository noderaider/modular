import { baseUrl } from '../config.js'
import fs from 'fs'
import path from 'path'

const getHotUrl = name => {
  const path = `${baseUrl}/__webpack_hmr`
  const timeout = 2000
  const overlay = true
  const reload = true
  const noInfo = false
  const quiet = false
  return 'webpack-hot-middleware/client' //?path=${path}&timeout=${timeout}&overlay=${overlay}&reload=${reload}&noInfo=${noInfo}&quiet=${quiet}`
}

function maybeHotEntry(name, ...entries) {
  if(process.env.NODE_ENV === 'hot') {
    return [ getHotUrl(name), ...entries ]
  }
  return entries[0]
}

export default name => {
  switch(name) {
    case 'lib':
      return { 'lib/index': './src/lib' }
  }
}
