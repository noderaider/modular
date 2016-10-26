import { dependencyNames } from '../config'

export default name => {

  /*
  switch(name) {
    case 'server':
      return dependencyNames.reduce((externals, name) => ({ ...externals, [name]: true }), {})
    case 'vendor':
      return  { 'react/lib/ReactCSSTransitionGroup': 'ReactCSSTransitionGroup'
              , 'react': 'React'
              , 'react-dom': 'ReactDOM'
              }
  }
  */
}
