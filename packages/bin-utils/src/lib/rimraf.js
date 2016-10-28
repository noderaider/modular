import rimraf from 'rimraf'
import { promisify, syncify } from './utils'

export default syncify(promisify(rimraf), rimraf.sync)
