import { promisify } from 'bluebird'
export default promisify(require('graceful-fs').stat)
