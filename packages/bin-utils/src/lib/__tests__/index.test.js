import * as binUtils from '../'

describe('bin-utils', () => {
  it('should be a function', () => {
    expect(typeof binUtils).toBe('object')
  })

  describe('')

  describe('rimraf', () => {
    it('should be function', () => {
      expect(typeof binUtils.rimraf).toBe('function')
    })
    it('should have sync function', () => {
      expect(typeof binUtils.rimraf.sync).toBe('function')
    })
  })

  describe('mkdirp', () => {
    it('should be function', () => {
      expect(typeof binUtils.mkdirp).toBe('function')
    })
    it('should have sync function', () => {
      expect(typeof binUtils.mkdirp.sync).toBe('function')
    })
  })

  describe('ncp', () => {
    it('should be function', () => {
      expect(typeof binUtils.ncp).toBe('function')
    })
    it('should have sync function', () => {
      expect(typeof binUtils.ncp.sync).toBe('function')
    })
  })

  describe('stat', () => {
    it('should be function', () => {
      expect(typeof binUtils.stat).toBe('function')
    })
    it('should have sync function', () => {
      expect(typeof binUtils.stat.sync).toBe('function')
    })
  })
})
