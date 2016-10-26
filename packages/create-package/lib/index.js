'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = createPackage;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _crossSpawn = require('cross-spawn');

var _crossSpawn2 = _interopRequireDefault(_crossSpawn);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _semver = require('semver');

var _semver2 = _interopRequireDefault(_semver);

var _pathExists = require('path-exists');

var _pathExists2 = _interopRequireDefault(_pathExists);

var _detectInPath = require('./utils/detectInPath');

var _detectInPath2 = _interopRequireDefault(_detectInPath);

var _install = require('./utils/install');

var _install2 = _interopRequireDefault(_install);

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createPackage(packageJSON) {
  if (!packageJSON) throw new Error('packageJSON must exist.');
  if (!packageJSON.name) throw new Error('packageJSON must have a name.');
  if (!packageJSON.version) throw new Error('packageJSON must have a version.');

  var templateName = packageJSON.name;
  var templateVersion = packageJSON.version;

  return function configureModule(name, opts) {
    if (!name && !opts) {
      var _argv = _yargs2.default.usage('Usage: ' + templateName + ' <project-directory> [options]\nversion: ' + templateVersion).describe('verbose', 'Print a lot of information.').help('h').alias('h', 'help').demand(1).argv;
      name = _argv._[0];
      opts = _argv;
    }

    if (!name) {
      argv.showHelp();
      process.exit(1);
    }
    return createModule(templateName, name, opts);
  };
}

function createModule(templateName, name) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      verbose = _ref.verbose,
      _ref$version = _ref.version,
      version = _ref$version === undefined ? '*' : _ref$version;

  var root = _path2.default.resolve(name);
  var packageName = _path2.default.basename(root);

  checkPackageName(packageName);

  if (!_pathExists2.default.sync(name)) {
    _fs2.default.mkdirSync(root);
  } else if (!isSafeToCreateProjectIn(root)) {
    console.log('The directory ' + name + ' contains file(s) that could conflict. Aborting.');
    process.exit(1);
  }
  var templateUrl = 'https://raw.githubusercontent.com/noderaider/scaffold/master/packages/bin-utils/packages/' + templateName + '.json?_c=' + Date.now();
  console.info('fetching template package.json from \'' + templateUrl + '\'');
  (0, _nodeFetch2.default)(templateUrl).then(function (res) {
    return res.json();
  }).then(function (template) {
    var packageJson = _extends({ name: packageName,
      version: '0.1.0',
      private: true
    }, template);
    var packageJsonStr = JSON.stringify(packageJson, null, 2);
    console.log('Creating a new package in ' + root + '.\n--package.json--\n', packageJsonStr);
    _fs2.default.writeFileSync(_path2.default.join(root, 'package.json'), packageJsonStr);
    var originalDirectory = process.cwd();
    process.chdir(root);

    run(root, packageName, templateName, version, verbose, originalDirectory, packageJson);
  }).catch(function (err) {
    console.error('ERROR OCCURRED DURING FETCH', _util2.default.inspect(err));
  });
}

function run(root, packageName, templateName, version, verbose, originalDirectory, packageJson) {
  var installPackage = getInstallPackage(version);
  var utilsName = getUtilsName(installPackage);

  console.log('Installing packages. This might take a couple minutes...');
  (0, _detectInPath2.default)('yarn', function (useYarn) {
    (0, _install2.default)(useYarn, useYarn ? _chalk2.default.bold.green('--yarn detected--') + ' | installing bin-utils at velocity c | ' + _chalk2.default.blue('(negligible error due to medium)') : _chalk2.default.bold.yellow('--yarn not detected--') + ' | installing bin-utils with npm\n\t' + _chalk2.default.bold.yellow('install yarn globally with `npm i -g yarn@latest` for a faster experience'), function () {

      checkNodeVersion(utilsName);

      var scriptsPath = _path2.default.resolve(process.cwd(), 'node_modules', utilsName, 'scripts', templateName, 'init.js');
      var init = require(scriptsPath).default;
      init(root, packageName, verbose, originalDirectory);
    });
  });
}

function getInstallPackage(version) {
  var packageToInstall = 'bin-utils';
  if (version === '*') return packageToInstall;
  var validSemver = _semver2.default.valid(version);
  if (validSemver) {
    packageToInstall += '@' + validSemver;
  } else if (version) {
    // for tar.gz or alternative paths
    packageToInstall = version;
  }
  return packageToInstall;
}

// Extract package name from tarball url or path.
function getUtilsName(installPackage) {
  if (installPackage.indexOf('.tgz') > -1) {
    // The package name could be with or without semver version, e.g. bin-utils-0.2.0-alpha.1.tgz
    // However, this function returns package name only wihout semver version.
    return installPackage.match(/^.+\/(.+?)(?:-\d+.+)?\.tgz$/)[1];
  } else if (installPackage.indexOf('@') > 0) {
    // Do not match @scope/ when stripping off @version or @tag
    return installPackage.charAt(0) + installPackage.substr(1).split('@')[0];
  }
  return installPackage;
}

function checkNodeVersion(packageName) {
  var packageJsonPath = _path2.default.resolve(process.cwd(), 'node_modules', packageName, 'package.json');
  var packageJson = require(packageJsonPath);
  if (!packageJson.engines || !packageJson.engines.node) return;

  if (!_semver2.default.satisfies(process.version, packageJson.engines.node)) {
    console.error(_chalk2.default.red('\nYou are currently running Node %s but create-package requires %s.\n Please use a supported version of Node.\n'), process.version, packageJson.engines.node);
    process.exit(1);
  }
}

function checkPackageName(packageName) {
  // TODO: there should be a single place that holds the dependencies
  var dependencies = [];
  var devDependencies = ['bin-utils'];
  var allDependencies = dependencies.concat(devDependencies).sort();

  if (allDependencies.indexOf(packageName) >= 0) {
    console.error(_chalk2.default.red('\nWe cannot create a project called \'' + packageName + '\' because a dependency with the same name exists.\nDue to the way npm works, the following names are not allowed:\n\n') + _chalk2.default.cyan(allDependencies.map(function (depName) {
      return '  ' + depName;
    }).join('\n')) + _chalk2.default.red('\n\nPlease choose a different project name.'));
    process.exit(1);
  }
}

function isSafeToCreateProjectIn(root) {
  var validFiles = ['.DS_Store', 'Thumbs.db', '.git', '.gitignore', '.idea', 'README.md', 'LICENSE'];
  return _fs2.default.readdirSync(root).every(function (file) {
    return validFiles.indexOf(file) >= 0;
  });
}