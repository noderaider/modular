import { Transform } from 'stream'

export default class FirstLineTransform extends Transform {
  constructor() {
    super({})
    this.isFinished = false
  }
  _transform(chunk, encoding, next) {
    if(this.isFinished)
      return next()
    const str = chunk.toString('utf8')
    if(str.includes('\n')) {
      const [ final ] = str.split('\n')
      this.push(final)
      this.isFinished = true
    } else {
      this.push(str)
    }
    next()
  }
}
