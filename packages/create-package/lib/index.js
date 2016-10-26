'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _pathExists = require('path-exists');

var _pathExists2 = _interopRequireDefault(_pathExists);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var argv = (0, _minimist2.default)(process.argv.slice(2));

function createPackage(scriptName, scriptVersion) {
  if (!scriptName) throw new Error('Must supply a scriptName argument.');
  if (!scriptVersion) throw new Error('Must supply a scriptVersion argument.');
  /**
   * Arguments:
   *   --version - to print current version
   *   --verbose - to print logs while init
   *   --bin-utils-version <alternative package>
   *     Example of valid values:
   *     - a specific npm version: "0.22.0-rc1"
   *     - a .tgz archive from any npm repo: "https://registry.npmjs.org/react-scripts/-/react-scripts-0.20.0.tgz"
   */

  var _argv$_ = _slicedToArray(argv._, 1);

  var name = _argv$_[0];

  if (!name) {
    if (argv.version) {
      console.log(scriptName + ' version: ' + version);
      process.exit();
    }
    console.error('Usage: ' + scriptName + ' <project-directory> [--verbose]');
    process.exit(1);
  }
  return _createPackage(name, argv.verbose, argv['bin-utils-version']);
}

function _createPackage(name, verbose, version) {
  var root = _path2.default.resolve(name);
  var packageName = _path2.default.basename(root);

  checkPackageName(packageName);

  if (!_pathExists2.default.sync(name)) {
    _fs2.default.mkdirSync(root);
  } else if (!isSafeToCreateProjectIn(root)) {
    console.log('The directory ' + name + ' contains file(s) that could conflict. Aborting.');
    process.exit(1);
  }

  console.log('Creating a new package in ' + root + '.\n');

  var packageJson = { name: packageName,
    version: '0.1.0',
    private: true
  };
  _fs2.default.writeFileSync(_path2.default.join(root, 'package.json'), JSON.stringify(packageJson, null, 2));
  var originalDirectory = process.cwd();
  process.chdir(root);

  console.log('Installing packages. This might take a couple minutes.');
  console.log('Installing bin-utils from npm...');
  console.log();
  run(root, packageName, version, verbose, originalDirectory);
}

function run(root, packageName, version, verbose, originalDirectory) {
  var installPackage = getInstallPackage(version);
  var packageName = getPackageName(installPackage);
  var args = ['install', verbose && '--verbose', '--save-dev', '--save-exact', installPackage].filter(function (e) {
    return e;
  });
  var proc = (0, _crossSpawn2.default)('npm', args, { stdio: 'inherit' });
  proc.on('close', function (code) {
    if (code !== 0) {
      console.error('`npm ' + args.join(' ') + '` failed');
      return;
    }

    checkNodeVersion(packageName);

    var scriptsPath = _path2.default.resolve(process.cwd(), 'node_modules', packageName, 'scripts', 'init.js');
    var init = require(scriptsPath);
    init(root, packageName, verbose, originalDirectory);
  });
}

function getInstallPackage(version) {
  var packageToInstall = 'bin-utils';
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
function getPackageName(installPackage) {
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
    console.error(_chalk2.default.red('\nYou are currently running Node %s but create-react-app requires %s.\n Please use a supported version of Node.\n'), process.version, packageJson.engines.node);
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

// If project only contains files generated by GH, it’s safe.
// We also special case IJ-based products .idea because it integrates with CRA:
// https://github.com/facebookincubator/create-react-app/pull/368#issuecomment-243446094
function isSafeToCreateProjectIn(root) {
  var validFiles = ['.DS_Store', 'Thumbs.db', '.git', '.gitignore', '.idea', 'README.md', 'LICENSE'];
  return _fs2.default.readdirSync(root).every(function (file) {
    return validFiles.indexOf(file) >= 0;
  });
}