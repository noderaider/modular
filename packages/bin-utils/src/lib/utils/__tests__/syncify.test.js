import syncify from '../syncify'

describe('syncify', () => {
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
