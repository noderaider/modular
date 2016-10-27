import babel from 'rollup-plugin-babel'
import babelrc from 'babelrc-rollup'

export default (
  { entry: 'src/index.js'
  , dest: 'dist/bundle.js'
  , format: 'umd'
  , moduleName: require('./package.json').name
  , plugins: [ babel(babelrc()) ]
  }
)
