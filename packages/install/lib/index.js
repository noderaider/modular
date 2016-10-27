'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.api = api;
exports.default = install;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _crossSpawn = require('cross-spawn');

var _crossSpawn2 = _interopRequireDefault(_crossSpawn);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _shouldUseYarn = require('./utils/shouldUseYarn');

var _shouldUseYarn2 = _interopRequireDefault(_shouldUseYarn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function api(args, argv, cb) {
  install(argv, cb);
}

function install(opts, cb) {
  if (cb) {
    _install(opts, cb);
  } else {
    return new Promise(function (resolve, reject) {
      _install(opts, function (result) {
        if (result instanceof Error) return reject(result);
        resolve();
      });
    });
  }
}

var YARN_ERROR_FALLBACK = _chalk2.default.bold.red('--yarn error occurred--') + ' | installing bin-utils with npm (fallback)';
var YARN_AUTODETECT_MESSAGE = _chalk2.default.bold.green('--yarn detected--') + ' | installing at velocity c';
var NPM_AUTODETECT_MESSAGE = _chalk2.default.bold.yellow('--yarn not detected--') + ' | installing at standard velocity (' + _chalk2.default.cyan('npm i -g yarn') + ' to go fast)';
var YARN_INSTALL_MESSAGE = _chalk2.default.bold.blue('--yarn install--') + ' | installing...';
var NPM_INSTALL_MESSAGE = _chalk2.default.bold.blue('--npm install--') + ' | installing...';

function _install() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$yarn = _ref.yarn,
      yarn = _ref$yarn === undefined ? false : _ref$yarn,
      _ref$npm = _ref.npm,
      npm = _ref$npm === undefined ? false : _ref$npm,
      _ref$yarnInstallMessa = _ref.yarnInstallMessage,
      yarnInstallMessage = _ref$yarnInstallMessa === undefined ? YARN_INSTALL_MESSAGE : _ref$yarnInstallMessa,
      _ref$npmInstallMessag = _ref.npmInstallMessage,
      npmInstallMessage = _ref$npmInstallMessag === undefined ? NPM_INSTALL_MESSAGE : _ref$npmInstallMessag,
      _ref$yarnAutodetectMe = _ref.yarnAutodetectMessage,
      yarnAutodetectMessage = _ref$yarnAutodetectMe === undefined ? YARN_AUTODETECT_MESSAGE : _ref$yarnAutodetectMe,
      _ref$npmAutodetectMes = _ref.npmAutodetectMessage,
      npmAutodetectMessage = _ref$npmAutodetectMes === undefined ? NPM_AUTODETECT_MESSAGE : _ref$npmAutodetectMes,
      _ref$verbose = _ref.verbose,
      verbose = _ref$verbose === undefined ? false : _ref$verbose;

  var cb = arguments[1];

  var opts = { yarn: yarn, npm: npm, yarnInstallMessage: yarnInstallMessage, npmInstallMessage: npmInstallMessage, yarnAutodetectMessage: yarnAutodetectMessage, npmAutodetectMessage: npmAutodetectMessage, verbose: verbose };
  (0, _shouldUseYarn2.default)({ yarn: yarn, npm: npm }, function (useYarn) {
    try {
      var autodetect = !yarn && !npm;
      var message = autodetect ? useYarn ? yarnAutodetectMessage : npmAutodetectMessage : useYarn ? yarnInstallMessage : npmInstallMessage;
      console.log(message);
      var executable = useYarn ? 'yarn' : 'npm';
      var args = (useYarn ? [] : ['install', verbose ? '--verbose' : '--silent']).filter(function (e) {
        return e;
      });

      (0, _crossSpawn2.default)(executable, args, { stdio: 'inherit' }).on('close', function (code) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        if (code !== 0) {
          if (useYarn) {
            fallback(opts, cb);
          } else {
            installFail.apply(undefined, [code].concat(args));
          }
        } else {
          cb();
        }
      });
    } catch (err) {
      if (useYarn) {
        fallback(opts, cb);
      } else {
        installFail(1, _util2.default.inspect(err));
      }
    }
  });
}

function installFail(code) {
  for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }

  console.error('--npm install failed with ' + code + '--\n' + args.join('\n'));
  process.exit(1);
}

function fallback(opts, cb) {
  console.warn('Error during yarn install, falling back to npm...');
  install(_extends({}, opts, { npm: true, npmInstallMessage: YARN_ERROR_FALLBACK }), cb);
}