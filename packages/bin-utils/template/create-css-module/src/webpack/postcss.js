import postcssModules from 'postcss-modules'
import postcssImport from 'postcss-import'
import postcssUrl from 'postcss-url'
import postcssCssnext from 'postcss-cssnext'
import postcssFontMagician from 'postcss-font-magician'
import postcssBrowserReporter from 'postcss-browser-reporter'
import postcssReporter from 'postcss-reporter'

import { IS_DEV } from '../config'

export default name => {
  return webpack => {

    const prodPostcss = [ postcssImport({ addDependencyTo: webpack })
                        , postcssUrl( { url: 'inline'
                          //, basePath: '../src/app'
                          //, assetsPath: '../images'
                          })
                        , postcssCssnext()
                        , postcssFontMagician()
                        /*
                        , postcssModules( { scopeBehaviour: 'global'
                                          } )
                                          */
                        ]
    if(!IS_DEV)
      return prodPostcss

    const messagesStyle = { color: 'rgb(255, 255, 255)'
                          , 'background-color': 'rgb(255, 100, 100)'
                          , position: 'fixed'
                          , 'font-family': 'Lato'
                          , 'z-index': 1000000
                          , top: '70px'
                          , width: '500px'
                          , 'margin-left': 'auto'
                          , 'margin-right': 'auto'
                          }
    return  [ ...prodPostcss
            , postcssBrowserReporter({ styles: messagesStyle })
            , postcssReporter()
            ]
  }
}
