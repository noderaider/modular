import { __rootname } from '../config'
import getDevTool from './devtool'
import getTarget from './target'
import getEntry from './entry'
import getOutput from './output'
import getResolve from './resolve'
import getResolveLoader from './resolveLoader'
import getModule from './module'
import getExternals from './externals'
import getPlugins from './plugins'
import getPostcss from './postcss'
import getNode from './node'

export default function make(name) {
  if(typeof name !== 'string')
    throw new Error('Name is required.')
  return  { name
          , context: __rootname
          , cache: true
          , target: getTarget(name)
          , devtool: getDevTool(name)
          , entry:  getEntry(name)
          , output: getOutput(name)
          , resolve: getResolve(name)
          , resolveLoader: getResolveLoader(name)
          , module: getModule(name)
          , externals: getExternals(name)
          , plugins: getPlugins(name)
          , node: getNode(name)
          , postcss: getPostcss(name)
          }
}
