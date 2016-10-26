import { server } from '../config.js'

export default name => {
  return 'cheap-module-source-map'
  switch(name) {
    case 'lib':
      return '#eval'
    case 'server':
      return 'source-map'
  }
  if(process.env.NODE_ENV === 'hot')
    return '#eval'
}
