import getLoaders from './loaders'
import getPostLoaders from './postLoaders'
import getNoParse from './noParse'

export default name => ({ loaders: getLoaders(name)
                        , postLoaders: getPostLoaders(name)
                        , noParse: getNoParse(name)
                        })
