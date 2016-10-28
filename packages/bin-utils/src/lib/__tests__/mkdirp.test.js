import mkdirp from '../mkdirp'

describe('mkdirp', () => {
  it('should be function', () => {
    expect(typeof mkdirp).toBe('function')
  })
  it('should have sync function', () => {
    expect(typeof mkdirp.sync).toBe('function')
  })
})
