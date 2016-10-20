import createReactRepo from '../'
import { mkdirp, ncp, rimraf } from 'bin-utils'
import path from 'path'


const stagingSource = path.resolve(__dirname, '..', '..', '..', 'staging')
const stagingPath = path.resolve(__dirname, '..', '..', '..', '_staging')

describe('create-react-repo', () => {
  it('should be a function', () => {
    expect(typeof createReactRepo).toBe('function')
  })
  beforeEach(() => rimraf(stagingPath).then(() => ncp(stagingSource, stagingPath)))

  it('should init a new repo in staging path', () => {
    const repoPath = path.resolve(stagingPath, 'repo')
    return createReactRepo(repoPath).then(() => {
      return stat(repoPath).then((stats) => {
        expect(typeof stats).toBe('object')
      }).catch((err) => {
        expect(err).toBe(undefined)
      })
    })
  })


})
