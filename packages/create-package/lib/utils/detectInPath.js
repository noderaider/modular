'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = detectInPath;

var _crossSpawn = require('cross-spawn');

var _crossSpawn2 = _interopRequireDefault(_crossSpawn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function detectInPath(name, cb) {
  try {
    var isWin = require('os').platform() === 'win32';
    (0, _crossSpawn2.default)(isWin ? 'where' : 'whereis', isWin ? ['/Q', name] : [name], { stdio: 'inherit', encoding: 'utf8' }).on('close', function (code) {
      return cb(code === 0);
    });
  } catch (err) {
    cb(false);
  }
}