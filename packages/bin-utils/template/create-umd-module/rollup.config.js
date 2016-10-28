import babel from 'rollup-plugin-babel'
import babelrc from 'babelrc-rollup'

export default (
  { entry: 'src/index.js'
  , dest: 'dist/bundle.js'
  , format: 'umd'
  , moduleName: require('./package.json').name.split('-').map((x, i) => i === 0 ? x : `${x[0]}${x.slice(1)}`).join('')
  , plugins: [ babel(babelrc()) ]
  }
)
