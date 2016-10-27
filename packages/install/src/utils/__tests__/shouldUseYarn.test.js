import shouldUseYarn from '../shouldUseYarn'
import sinon from 'sinon'

jest.mock('@raider/which')
const which = require('@raider/which').default
which.mockImplementation((name, cb) => cb([ 'node', 'npm', 'yarn' ].includes(name) ? `/usr/bin/${name}` : false))

describe('shouldUseYarn', () => {
  it('should be a function', () => {
    expect(typeof shouldUseYarn).toBe('function')
  })

  const testSet = (desc, opts, expected) => {
    describe(desc, () => {
      it('should call the callback once', () => {
        const cb = sinon.spy()
        shouldUseYarn(opts, cb, `cb test: ${desc}`)
        expect(cb.calledOnce).toBe(true)
      })
      it(`should return ${expected}`, () => {
        shouldUseYarn(opts, (result) => {
          expect(result).toBe(expected)
        }, `returns expected: ${desc} => ${expected}`)
      })
    })
  }

  describe('yarn in path', () => {
    testSet('npm: true', { npm: true }, false)
    testSet('yarn: true', { yarn: true }, true)
    testSet('autodetect (empty)', {}, true)
  })
})
