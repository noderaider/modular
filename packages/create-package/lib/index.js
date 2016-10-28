'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var createModule = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(templateName, name) {
    var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref2$verbose = _ref2.verbose,
        verbose = _ref2$verbose === undefined ? false : _ref2$verbose,
        _ref2$version = _ref2.version,
        version = _ref2$version === undefined ? '*' : _ref2$version;

    var root, packageName, templateUrl, res, template, packageJson, packageJsonStr, originalDirectory;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            root = _path2.default.resolve(name);
            packageName = _path2.default.basename(root);


            checkPackageName(packageName);

            if (_pathExists2.default.sync(name)) {
              _context.next = 9;
              break;
            }

            _context.next = 7;
            return _fs2.default.mkdir(root);

          case 7:
            _context.next = 10;
            break;

          case 9:
            if (!isSafeToCreateProjectIn(root)) {
              console.log('The directory ' + name + ' contains file(s) that could conflict. Aborting.');
              process.exit(1);
            }

          case 10:
            templateUrl = 'https://raw.githubusercontent.com/noderaider/modular/master/packages/bin-utils/packages/' + templateName + '.json?_c=' + Date.now();

            console.info('fetching template package.json from \'' + templateUrl + '\'');
            _context.next = 14;
            return (0, _nodeFetch2.default)(templateUrl);

          case 14:
            res = _context.sent;
            _context.next = 17;
            return res.json();

          case 17:
            template = _context.sent;
            packageJson = (0, _extends3.default)({ name: packageName,
              version: '0.1.0',
              private: true
            }, template);
            packageJsonStr = (0, _stringify2.default)(packageJson, null, 2);

            console.log('Creating a new package in ' + root + '.\n--package.json--\n', packageJsonStr);
            _context.next = 23;
            return _fs2.default.writeFile(_path2.default.join(root, 'package.json'), packageJsonStr);

          case 23:
            originalDirectory = process.cwd();

            process.chdir(root);

            _context.next = 27;
            return run(root, packageName, templateName, version, verbose, originalDirectory, packageJson);

          case 27:
            _context.next = 32;
            break;

          case 29:
            _context.prev = 29;
            _context.t0 = _context['catch'](0);

            console.error('ERROR OCCURRED DURING FETCH', _util2.default.inspect(_context.t0));

          case 32:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 29]]);
  }));

  return function createModule(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var run = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(root, packageName, templateName, version, verbose, originalDirectory, packageJson) {
    var installPackage, utilsName, scriptsPath, init;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            installPackage = getInstallPackage(version);
            utilsName = getUtilsName(installPackage);


            console.log('Installing packages. This might take a couple minutes...');
            _context2.next = 5;
            return (0, _install2.default)({ verbose: verbose });

          case 5:

            checkNodeVersion(utilsName);

            scriptsPath = _path2.default.resolve(process.cwd(), 'node_modules', utilsName, 'scripts', templateName, 'init.js');
            init = require(scriptsPath).default;

            init(root, packageName, verbose, originalDirectory);

          case 9:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function run(_x5, _x6, _x7, _x8, _x9, _x10, _x11) {
    return _ref3.apply(this, arguments);
  };
}();

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

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _install = require('@raider/install');

var _install2 = _interopRequireDefault(_install);

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