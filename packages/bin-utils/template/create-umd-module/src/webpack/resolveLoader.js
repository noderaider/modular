import { resolveRoot } from '../config.js'

export default name => {
  return  { root: resolveRoot('node_modules')
          , fallback: resolveRoot('node_modules')
          , extensions: [ '', '.jsx', '.js', '.json' ]
          }
}
