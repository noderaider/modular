import ncp from 'ncp'
import { promisify, syncify } from './utils'

export default syncify(promisify(ncp))
