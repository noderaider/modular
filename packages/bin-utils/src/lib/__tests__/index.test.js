import * as binUtils from '../'

describe('bin-utils', () => {
  it('should be a function', () => {
    expect(typeof binUtils).toBe('object')
  })
  it('should have rimraf', () => {
    expect(typeof binUtils.rimraf).toBe('function')
  })
  it('should have mkdirp', () => {
    expect(typeof binUtils.mkdirp).toBe('function')
  })
  it('should have ncp', () => {
    expect(typeof binUtils.ncp).toBe('function')
  })
})
