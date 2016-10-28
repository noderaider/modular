import stat from '../stat'

describe('stat', () => {
  it('should be function', () => {
    expect(typeof stat).toBe('function')
  })
  it('should have sync function', () => {
    expect(typeof stat.sync).toBe('function')
  })
})
