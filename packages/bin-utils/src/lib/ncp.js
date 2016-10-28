import ncp from 'ncp'
import { promisify } from './utils'

export default promisify(ncp)
