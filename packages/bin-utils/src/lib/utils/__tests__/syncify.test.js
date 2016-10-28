import syncify from '../syncify'

describe('syncify', () => {
  it('adds a sync function', () => {
    expect(typeof syncify(() => {}).sync).toBe('function')
  })
  it('throws for non function', () => {
    expect(() => typeof syncify({})).toThrow()
  })
  it('accepts an optional sync function', () => {
    const sync = () => { return 'SYNC_FINISHED' }
    expect(syncify(() => {}, sync).sync).toBe(sync)
  })
  it('throws for non sync function', () => {
    expect(() => syncify(() => {}, {})).toThrow()
  })
})
