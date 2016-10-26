'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = install;

var _crossSpawn = require('cross-spawn');

var _crossSpawn2 = _interopRequireDefault(_crossSpawn);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function installFail(code) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  console.error('--npm install failed with ' + code + '--\n' + args.join('\n'));
  process.exit(1);
}

function fallback(verbose, cb) {
  console.warn('Error during yarn install, falling back to npm...');
  install(false, { message: chalk.bold.yellow('--yarn error occurred--') + ' | installing bin-utils with npm (fallback)', verbose: verbose }, cb);
}

function install(useYarn) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      message = _ref.message,
      verbose = _ref.verbose;

  var cb = arguments[2];

  try {
    console.log(message);
    var executable = useYarn ? 'yarn' : 'npm';
    var args = (useYarn ? [] : ['install', verbose ? '--verbose' : '--silent']).filter(function (e) {
      return e;
    });

    (0, _crossSpawn2.default)(executable, args, { stdio: 'inherit' }).on('close', function (code) {
      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      if (code !== 0) {
        if (useYarn) {
          fallback(verbose, cb);
        } else {
          installFail.apply(undefined, [code].concat(args));
        }
      } else {
        cb();
      }
    });
  } catch (err) {
    if (useYarn) {
      fallback(verbose, cb);
    } else {
      installFail(1, _util2.default.inspect(err));
    }
  }
}