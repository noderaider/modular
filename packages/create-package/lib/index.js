import fs from 'fs'
import path from 'path'
import spawn from 'cross-spawn'
import chalk from 'chalk'
import semver from 'semver'
import minimist from 'minimist'
import pathExists from 'path-exists'
const argv = minimist(process.argv.slice(2))


export default function createPackage(scriptName, scriptVersion) {
  if(!scriptName)
    throw new Error('Must supply a scriptName argument.')
  if(!scriptVersion)
    throw new Error('Must supply a scriptVersion argument.')
  /**
   * Arguments:
   *   --version - to print current version
   *   --verbose - to print logs while init
   *   --bin-utils-version <alternative package>
   *     Example of valid values:
   *     - a specific npm version: "0.22.0-rc1"
   *     - a .tgz archive from any npm repo: "https://registry.npmjs.org/react-scripts/-/react-scripts-0.20.0.tgz"
   */
  const [ name ] = argv._
  if (!name) {
    if (argv.version) {
      console.log(`${scriptName} version: ${version}`)
      process.exit()
    }
    console.error(`Usage: ${scriptName} <project-directory> [--verbose]`)
    process.exit(1)
  }
  return _createPackage(name, argv.verbose, argv['bin-utils-version'])
}

function _createPackage(name, verbose, version) {
  var root = path.resolve(name)
  var packageName = path.basename(root)

  checkPackageName(packageName)

  if (!pathExists.sync(name)) {
    fs.mkdirSync(root)
  } else if (!isSafeToCreateProjectIn(root)) {
    console.log(`The directory ${name} contains file(s) that could conflict. Aborting.`)
    process.exit(1)
  }

  console.log(`Creating a new package in ${root}.\n`)

  const packageJson = (
    { name: packageName
    , version: '0.1.0'
    , private: true
    }
  )
  fs.writeFileSync(
    path.join(root, 'package.json')
  , JSON.stringify(packageJson, null, 2)
  )
  var originalDirectory = process.cwd()
  process.chdir(root)

  console.log('Installing packages. This might take a couple minutes.')
  console.log('Installing bin-utils from npm...')
  console.log()
  run(root, packageName, version, verbose, originalDirectory)
}

function run(root, packageName, version, verbose, originalDirectory) {
  var installPackage = getInstallPackage(version)
  var packageName = getPackageName(installPackage)
  var args = [
    'install'
    , verbose && '--verbose'
    , '--save-dev'
    , '--save-exact'
    , installPackage
   ].filter((e) => { return e })
  var proc = spawn('npm', args, { stdio: 'inherit' })
  proc.on('close', (code) => {
    if (code !== 0) {
      console.error('`npm ' + args.join(' ') + '` failed')
      return
    }

    checkNodeVersion(packageName)

    var scriptsPath = path.resolve(
      process.cwd(),
      'node_modules',
      packageName,
      'scripts',
      'init.js'
    )
    var init = require(scriptsPath)
    init(root, packageName, verbose, originalDirectory)
  })
}

function getInstallPackage(version) {
  var packageToInstall = 'bin-utils'
  var validSemver = semver.valid(version)
  if (validSemver) {
    packageToInstall += '@' + validSemver
  } else if (version) {
    // for tar.gz or alternative paths
    packageToInstall = version
  }
  return packageToInstall
}

// Extract package name from tarball url or path.
function getPackageName(installPackage) {
  if (installPackage.indexOf('.tgz') > -1) {
    // The package name could be with or without semver version, e.g. bin-utils-0.2.0-alpha.1.tgz
    // However, this function returns package name only wihout semver version.
    return installPackage.match(/^.+\/(.+?)(?:-\d+.+)?\.tgz$/)[1]
  } else if (installPackage.indexOf('@') > 0) {
    // Do not match @scope/ when stripping off @version or @tag
    return installPackage.charAt(0) + installPackage.substr(1).split('@')[0]
  }
  return installPackage
}

function checkNodeVersion(packageName) {
  const packageJsonPath = path.resolve(
    process.cwd()
  , 'node_modules'
  , packageName
  , 'package.json'
  )
  const packageJson = require(packageJsonPath)
  if (!packageJson.engines || !packageJson.engines.node)
    return

  if (!semver.satisfies(process.version, packageJson.engines.node)) {
    console.error(chalk.red(`
You are currently running Node %s but create-react-app requires %s.
 Please use a supported version of Node.\n`
      )
    , process.version
    , packageJson.engines.node
    )
    process.exit(1)
  }
}

function checkPackageName(packageName) {
  // TODO: there should be a single place that holds the dependencies
  var dependencies = []
  var devDependencies = [ 'bin-utils' ]
  var allDependencies = dependencies.concat(devDependencies).sort()

  if (allDependencies.indexOf(packageName) >= 0) {
    console.error(
      chalk.red(`
We cannot create a project called '${packageName}' because a dependency with the same name exists.
Due to the way npm works, the following names are not allowed:\n\n`) +
      chalk.cyan(allDependencies.map((depName) => `  ${depName}`).join('\n')) +
      chalk.red('\n\nPlease choose a different project name.')
    )
    process.exit(1)
  }
}

// If project only contains files generated by GH, it’s safe.
// We also special case IJ-based products .idea because it integrates with CRA:
// https://github.com/facebookincubator/create-react-app/pull/368#issuecomment-243446094
function isSafeToCreateProjectIn(root) {
  var validFiles = [
    '.DS_Store', 'Thumbs.db', '.git', '.gitignore', '.idea', 'README.md', 'LICENSE'
  ]
  return fs.readdirSync(root).every((file) => validFiles.indexOf(file) >= 0)
}
