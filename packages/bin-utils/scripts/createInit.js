'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createInit;

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _crossSpawn = require('cross-spawn');

var _crossSpawn2 = _interopRequireDefault(_crossSpawn);

var _pathExists = require('path-exists');

var _pathExists2 = _interopRequireDefault(_pathExists);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createInit(name) {
  return function init(appPath, appName, verbose, originalDirectory) {
    var ownPackageName = require(_path2.default.join(__dirname, '..', 'package.json')).name;
    var ownPath = _path2.default.join(appPath, 'node_modules', ownPackageName);
    var appPackage = require(_path2.default.join(appPath, 'package.json'));

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

    var readmeExists = _pathExists2.default.sync(_path2.default.join(appPath, 'README.md'));
    if (readmeExists) _fsExtra2.default.renameSync(_path2.default.join(appPath, 'README.md'), _path2.default.join(appPath, 'README.old.md'));

    // Copy the files for the user
    _fsExtra2.default.copySync(_path2.default.join(ownPath, 'template', name), appPath);

    // Rename gitignore after the fact to prevent npm from renaming it to .npmignore
    // See: https://github.com/npm/npm/issues/1862
    _fsExtra2.default.move(_path2.default.join(appPath, 'gitignore'), _path2.default.join(appPath, '.gitignore'), [], function (err) {
      if (err) {
        // Append if there's already a `.gitignore` file there
        if (err.code === 'EEXIST') {
          var data = _fsExtra2.default.readFileSync(_path2.default.join(appPath, 'gitignore'));
          _fsExtra2.default.appendFileSync(_path2.default.join(appPath, '.gitignore'), data);
          _fsExtra2.default.unlinkSync(_path2.default.join(appPath, 'gitignore'));
        } else {
          throw err;
        }
      }
    });

    /*
        // Run another npm install for react and react-dom
        console.log('Installing react and react-dom from npm...')
        console.log()
        // TODO: having to do two npm installs is bad, can we avoid it?
        var args = [
          'install'
        , 'react'
        , 'react-dom'
        , '--save'
        , verbose && '--verbose'
        ].filter((x) => x)
        var proc = spawn('npm', args, { stdio: 'inherit' })
        proc.on('close', (code) => {
          if (code !== 0) {
            console.error('`npm ' + args.join(' ') + '` failed')
            return
          }
          */

    // Display the most elegant way to cd.
    // This needs to handle an undefined originalDirectory for
    // backward compatibility with old global-cli's.
    var cdpath = originalDirectory && _path2.default.join(originalDirectory, appName) === appPath ? appName : appPath;

    console.log();
    console.log('Success! Created ' + appName + ' at ' + appPath);
    console.log('Inside that directory, you can run several commands:');
    console.log();
    console.log(_chalk2.default.cyan('  npm start'));
    console.log('    Starts the development server.');
    console.log();
    console.log(_chalk2.default.cyan('  npm run build'));
    console.log('    Bundles the app into static files for production.');
    console.log();
    console.log(_chalk2.default.cyan('  npm test'));
    console.log('    Starts the test runner.');
    console.log();
    console.log(_chalk2.default.cyan('  npm run eject'));
    console.log('    Removes this tool and copies build dependencies, configuration files');
    console.log('    and scripts into the app directory. If you do this, you can’t go back!');
    console.log();
    console.log('We suggest that you begin by typing:');
    console.log();
    console.log(_chalk2.default.cyan('  cd'), cdpath);
    console.log('  ' + _chalk2.default.cyan('npm start'));
    if (readmeExists) {
      console.log();
      console.log(_chalk2.default.yellow('You had a `README.md` file, we renamed it to `README.old.md`'));
    }
    console.log();
    console.log('Happy hacking!');
    //})
  };
} /**
   * Copyright (c) 2015-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * NOTE: This file was originally written by Facebook and modified by Cole Chamberlain.
   */