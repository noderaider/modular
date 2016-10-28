import promisify from '../promisify'

describe('promisify', () => {
  it('returns original when callback passed', () => {
    const fn = (foo, bar, cb) => ({ foo, bar, cb })
    const promisified = promisify(fn)
    const result = promisified('foo', 'bar', () => {})
    expect(result instanceof Promise).toBe(false)
  })

  it('returns promise when callback omitted', () => {
    const fn = (foo, bar, cb) => ({ foo, bar, cb })
    const promisified = promisify(fn)
    const result = promisified('foo', 'bar')
    expect(result instanceof Promise).toBe(true)
  })
})
