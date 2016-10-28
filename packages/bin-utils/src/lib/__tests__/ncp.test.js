import ncp from '../ncp'

describe('ncp', () => {
  it('should be function', () => {
    expect(typeof ncp).toBe('function')
  })
  it('should have sync function', () => {
    expect(typeof ncp.sync).toBe('function')
  })
})
