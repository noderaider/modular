'use strict';

var _crossSpawn = require('cross-spawn');

var _crossSpawn2 = _interopRequireDefault(_crossSpawn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function install(useYarn, message, cb) {
  try {
    (function () {
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
          console.error(executable + ' ' + args.join(' ') + ' failed with ' + code + ':\n' + args.join('\n'));
          process.exit(1);
        }
        cb();
      });
    })();
  } catch (err) {
    cb(err);
  }
}