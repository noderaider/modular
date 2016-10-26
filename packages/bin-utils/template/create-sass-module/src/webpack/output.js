import { libName, baseUrl, resolveRoot } from '../config.js'
import { join } from 'path'

const getPath = name => {
  switch(name) {
    case 'lib':
      return resolveRoot('.')
    case 'server':
      return resolveRoot('lib', 'app')
    case 'static':
      return resolveRoot('public', 'assets')
    default:
      return resolveRoot('public', 'assets')
  }
}

const getPublicPath = name => {
  switch(name) {
    case 'lib':
      return '/'
    case 'server':
      return '/lib/app'
    case 'static':
      return `${baseUrl}/assets/`
    default:
      return `${baseUrl}/assets/`
  }
}


const getLibrary = name => {
  return libName
}

const getLibraryTarget = name => {
  switch(name) {
    case 'lib':
      return 'umd'
    case 'server':
      return 'commonjs2'
  }
}

const getFilename = name => '[name].js'
const getChunkFilename = name => '[name].js'
const getSourceMapFilename = name => '[file].map'
const getDevtoolModuleFilenameTemplate = name => 'file:///[absolute-resource-path]'
const getHotUpdateChunkFilename = name => '[id].[hash].hot-update.js'
const getHotUpdateMainFilename = name => '[hash].hot-update.json'
const getCrossOriginLoading = name => 'anonymous'



export default name => {
  let output =  { path: getPath(name)
                , library: getLibrary(name)
                , libraryTarget: getLibraryTarget(name)
                , pathinfo: process.env.NODE_ENV === 'hot'
                , publicPath: getPublicPath(name)
                , filename: getFilename(name)
                , chunkFilename: getChunkFilename(name)
                , crossOriginLoading: getCrossOriginLoading(name)
                //, devtoolModuleFilenameTemplate: getDevtoolModuleFilenameTemplate(name)
                //, sourceMapFilename: getSourceMapFilename(name)
                //, hotUpdateChunkFilename: getHotUpdateChunkFilename(name)
                //, hotUpdateMainFilename: getHotUpdateMainFilename(name)
                }
  console.warn('OUTPUT', JSON.stringify(output, null, 2))
  return output
}
