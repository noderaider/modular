import { __rootname, resolveRoot } from '../../config.js'
import getAlias from './alias'

export default name => {
  return  { root: [ __rootname ]
          , alias: getAlias(name)
          , fallback: resolveRoot('node_modules')
          , extensions: [ '', '.jsx', '.js', '.json' ]
          }
}
