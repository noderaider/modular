import which from '../'
import sinon from 'sinon'

jest.useFakeTimers()

describe('which', () => {
  it('is a function', () => {
    expect(typeof which).toBe('function')
  })
  it('calls callback', () => {
    const cb = sinon.spy()
    which('node', cb)
    jest.runOnlyPendingTimers()
    expect(cb.calledOnce).toBe(true)
  })
  it('returns string for existing executable', () => {
    const cb = sinon.spy()
    which('node', cb)
    jest.runOnlyPendingTimers()
    expect(cb.calledWith('/usr/bin/node')).toBe(true)
  })
  it('returns false for non-existant executable', () => {
    const cb = sinon.spy()
    which('blahblahblah', cb)
    jest.runOnlyPendingTimers()
    expect(cb.calledWith(false)).toBe(true)
  })

  it('returns promise for single arg', () => {
    const promise = which('node')
    jest.runOnlyPendingTimers()
    expect(promise instanceof Promise).toBe(true)
  })
  it('promise resolves string for existing executable', () => {
    const promise = which('node').then((result) => {
      expect(result).toBe('/usr/bin/node')
    })
    jest.runOnlyPendingTimers()
    return promise
  })
  it('promise resolves false for non-existant executable', () => {
    const promise = which('blahblahblah').then((result) => {
      expect(result).toBe(false)
    })
    jest.runOnlyPendingTimers()
    return promise
  })
})
