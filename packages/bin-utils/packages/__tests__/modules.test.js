import path from 'path'
import fs from 'fs'

const packageNames = fs.readdirSync(path.resolve(__dirname, '..')).filter((x) => x !== '__tests__').map((x) => path.join('..', path.basename(x)))

describe('packages', () => {
  for(let packageName of packageNames) {
    describe(packageName, () => {
      it('can be imported', () => {
        expect(typeof require(packageName)).toBe('object')
      })
    })
  }
})
