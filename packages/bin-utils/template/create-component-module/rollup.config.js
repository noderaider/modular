import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'

export default (
  { entry: 'src/index.js'
  , dest: 'dist/bundle.js'
  , format: 'cjs'
  , external: [ 'react' ]
  , plugins:  [ babel()
              , nodeResolve({ jsnext: true, main: true })
              , commonjs({ include: 'node_modules/**' })
              ]
  }
)
