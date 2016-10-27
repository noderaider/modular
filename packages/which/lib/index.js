'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.api = api;
exports.default = which;

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _crossSpawn = require('cross-spawn');

var _crossSpawn2 = _interopRequireDefault(_crossSpawn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function api(args, opts, cb) {
  if (args.length !== 1) throw new Error('which requires exactly 1 argument name (and a callback for api)');

  var _args = _slicedToArray(args, 1),
      name = _args[0];

  return which(name, cb);
}

function which(name, cb) {
  if (!name) throw new Error('which requires a name argument');
  try {
    var isWin = require('os').platform() === 'win32';
    (0, _crossSpawn2.default)(isWin ? 'where' : 'whereis', isWin ? [name] : [name], { stdio: 'inherit', encoding: 'utf8' }).on('close', function (code) {
      return cb(code === 0);
    });
  } catch (err) {
    cb(false);
  }
}