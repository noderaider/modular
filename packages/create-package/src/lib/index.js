import fs from 'fs'
import path from 'path'
import spawn from 'cross-spawn'
import chalk from 'chalk'
import semver from 'semver'
import pathExists from 'path-exists'
import detectInPath from './utils/detectInPath'
import install from './utils/install'
import fetch from 'node-fetch'
import yargs from 'yargs'
import util from 'util'

export default function createPackage(packageJSON) {
  if(!packageJSON)
    throw new Error('packageJSON must exist.')
  if(!packageJSON.name)
    throw new Error('packageJSON must have a name.')
  if(!packageJSON.version)
    throw new Error('packageJSON must have a version.')

  const templateName = packageJSON.name
  const templateVersion = packageJSON.version

  return function configureModule (name, opts) {
    if (!name && !opts) {
      const argv = yargs
        .usage(`Usage: ${templateName} <project-directory> [options]\nversion: ${templateVersion}`)
        .describe('verbose', 'Print a lot of information.')
        .help('h')
        .alias('h', 'help')
        .demand(1)
        .argv
      name = argv._[0]
      opts = argv
    }

    if (!name) {
      argv.showHelp()
      process.exit(1)
    }
    return createModule(templateName, name, opts)
  }
}

function createModule(templateName, name, { verbose = false, version = '*' } = {}) {
  var root = path.resolve(name)
  var packageName = path.basename(root)

  checkPackageName(packageName)

  if (!pathExists.sync(name)) {
    fs.mkdirSync(root)
  } else if (!isSafeToCreateProjectIn(root)) {
    console.log(`The directory ${name} contains file(s) that could conflict. Aborting.`)
    process.exit(1)
  }
  const templateUrl = `https://raw.githubusercontent.com/noderaider/scaffold/master/packages/bin-utils/packages/${templateName}.json?_c=${Date.now()}`
  console.info(`fetching template package.json from '${templateUrl}'`)
  fetch(templateUrl)
    .then((res) => res.json())
    .then((template) => {
      const packageJson = (
        { name: packageName
        , version: '0.1.0'
        , private: true
        , ...template
        }
      )
      const packageJsonStr = JSON.stringify(packageJson, null, 2)
      console.log(`Creating a new package in ${root}.\n--package.json--\n`, packageJsonStr)
      fs.writeFileSync (
        path.join(root, 'package.json')
      , packageJsonStr
      )
      var originalDirectory = process.cwd()
      process.chdir(root)

      run(root, packageName, templateName, version, verbose, originalDirectory, packageJson)
    })
    .catch((err) => {
      console.error('ERROR OCCURRED DURING FETCH', util.inspect(err))
    })

}

function run(root, packageName, templateName, version, verbose, originalDirectory, packageJson) {
  const installPackage = getInstallPackage(version)
  const utilsName = getUtilsName(installPackage)

  console.log('Installing packages. This might take a couple minutes...')
  detectInPath('yarn', (useYarn) => {
    const opts = (
      { message: useYarn ? `${chalk.bold.green('--yarn detected--')} | installing bin-utils at velocity c | ${chalk.blue('(negligible error due to medium)')}` : `${chalk.bold.yellow('--yarn not detected--')} | installing bin-utils with npm\n\t${chalk.bold.yellow('install yarn globally with `npm i -g yarn@latest` for a faster experience')}`
      , verbose
      }
    )
    install(useYarn, opts, () => {
      checkNodeVersion(utilsName)

      const scriptsPath = path.resolve(
        process.cwd()
      , 'node_modules'
      , utilsName
      , 'scripts'
      , templateName
      , 'init.js'
      )
      const init = require(scriptsPath).default
      init(root, packageName, verbose, originalDirectory)
    })
  })
}

function getInstallPackage(version) {
  var packageToInstall = 'bin-utils'
  if(version === '*')
    return packageToInstall
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
function getUtilsName(installPackage) {
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
You are currently running Node %s but create-package requires %s.
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

function isSafeToCreateProjectIn(root) {
  const validFiles = [ '.DS_Store', 'Thumbs.db', '.git', '.gitignore', '.idea', 'README.md', 'LICENSE' ]
  return fs.readdirSync(root).every((file) => validFiles.indexOf(file) >= 0)
}
