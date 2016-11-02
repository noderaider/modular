import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'

export default (
  { entry: 'src/index.js'
  , dest: 'dist/bundle.js'
  , format: 'umd'
  , moduleName: require('./package.json').name.split('-').map((x, i) => i === 0 ? x : `${x[0]}${x.slice(1)}`).join('')
  , plugins:  [ babel({ babelrc: false
                      , exclude: 'node_modules/**'
                      , presets: [ [ 'es2015', { modules: false } ], 'stage-0' ]
                      , plugins: [ 'transform-runtime' ]
                      , runtimeHelpers: true
                      })
              , nodeResolve({ jsnext: true, main: true })
              , commonjs({ include: 'node_modules/**' })
              ]
  }
)
