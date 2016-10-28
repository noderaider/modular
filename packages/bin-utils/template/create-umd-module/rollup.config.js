import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'

export default (
  { entry: 'src/index.js'
  , dest: 'dist/bundle.js'
  , format: 'umd'
  , external: [ 'react', 'react-dom' ]
  , plugins:  [ babel({ babelrc: false
                      , exclude: 'node_modules/**'
                      , presets: [ [ 'es2015', { modules: false } ], 'stage-0', 'react' ]
                      , plugins: [ 'external-helpers', 'transform-runtime' ]
                      })
              , nodeResolve({ jsnext: true, main: true })
              , commonjs({ include: 'node_modules/**' })
              ]
  }
)
