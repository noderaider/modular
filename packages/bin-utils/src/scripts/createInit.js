/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * NOTE: This file was originally written by Facebook and modified by Cole Chamberlain.
 */

import fs from 'fs-extra'
import path from 'path'
import spawn from 'cross-spawn'
import pathExists from 'path-exists'
import chalk from 'chalk'

export default function createInit(name, printUsage = (cdpath) => {
  console.log(chalk.cyan('  npm start'))
  console.log('    Starts the module in hot rebuild mode. (Run this then run your downstream app with hot module reload)')
  console.log()
  console.log(chalk.cyan('  npm run build'))
  console.log('    Bundles the app into static files for production.')
  console.log()
  console.log('We suggest that you begin by typing:')
  console.log()
  console.log(chalk.cyan('  cd'), cdpath)
  console.log('  ' + chalk.cyan('npm start'))
}) {
  return function init (appPath, appName, verbose, originalDirectory) {
    const ownPackageName = require(path.join(__dirname, '..', 'package.json')).name
    const ownPath = path.join(appPath, 'node_modules', ownPackageName)
    const appPackage = require(path.join(appPath, 'package.json'))

    // Setup the script rules
    /*
    appPackage.scripts = (
      { start: 'bin-utils start'
      , build: 'bin-utils build'
      , test: 'bin-utils test --env=jsdom'
      , eject: 'bin-utils eject'
      }
    )

    fs.writeFileSync(
      path.join(appPath, 'package.json')
    , JSON.stringify(appPackage, null, 2)
    )
    */

    const readmeExists = pathExists.sync(path.join(appPath, 'README.md'))
    if (readmeExists)
      fs.renameSync(path.join(appPath, 'README.md'), path.join(appPath, 'README.old.md'))

    // Copy the files for the user
    fs.copySync(path.join(ownPath, 'template', name), appPath)

    // Rename gitignore after the fact to prevent npm from renaming it to .npmignore
    // See: https://github.com/npm/npm/issues/1862
    fs.move(path.join(appPath, 'gitignore'), path.join(appPath, '.gitignore'), [], (err) => {
      if (err) {
        // Append if there's already a `.gitignore` file there
        if (err.code === 'EEXIST') {
          var data = fs.readFileSync(path.join(appPath, 'gitignore'))
          fs.appendFileSync(path.join(appPath, '.gitignore'), data)
          fs.unlinkSync(path.join(appPath, 'gitignore'))
        } else {
          throw err
        }
      }
    })

    fs.move(path.join(appPath, 'npmignore'), path.join(appPath, '.npmignore'), [], (err) => {
      if (err) {
        // Append if there's already a `.npmignore` file there
        if (err.code === 'EEXIST') {
          var data = fs.readFileSync(path.join(appPath, 'npmignore'))
          fs.appendFileSync(path.join(appPath, '.npmignore'), data)
          fs.unlinkSync(path.join(appPath, 'npmignore'))
        } else {
          throw err
        }
      }
    })


    // Display the most elegant way to cd.
    // This needs to handle an undefined originalDirectory for
    // backward compatibility with old global-cli's.
    let cdpath = (originalDirectory && path.join(originalDirectory, appName) === appPath) ? appName : appPath

    console.log()
    console.log('Success! Created ' + appName + ' at ' + appPath)
    console.log('Inside that directory, you can run several commands:')
    console.log()

    printUsage(cdpath)

    if (readmeExists) {
      console.log()
      console.log(chalk.yellow('You had a `README.md` file, we renamed it to `README.old.md`'))
    }
    console.log()
    console.log('Happy hacking!')
  }
}
