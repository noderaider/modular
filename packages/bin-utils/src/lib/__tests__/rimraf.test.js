import rimraf from '../rimraf'

describe('rimraf', () => {
  it('should be function', () => {
    expect(typeof rimraf).toBe('function')
  })
  it('should have sync function', () => {
    expect(typeof rimraf.sync).toBe('function')
  })
})
