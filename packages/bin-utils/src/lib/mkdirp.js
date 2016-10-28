import mkdirp from 'mkdirp'
import { promisify, syncify } from './utils'

export default syncify(promisify(mkdirp), mkdirp.sync)
