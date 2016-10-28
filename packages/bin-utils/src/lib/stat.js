import fs from 'graceful-fs'
import { promisify, syncify } from './utils'

export default syncify(promisify(fs.stat), fs.statSync)
