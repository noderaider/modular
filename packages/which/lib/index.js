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

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _FirstLineTransform = require('./streams/FirstLineTransform');

var _FirstLineTransform2 = _interopRequireDefault(_FirstLineTransform);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function api(args, opts, cb) {
  if (args.length !== 1) throw new Error('which requires exactly 1 argument name (and a callback for api)');

  var _args = _slicedToArray(args, 1),
      name = _args[0];

  return which(name, cb);
}

function which(name, cb) {
  if (cb) {
    _which(name, cb);
  } else {
    return new Promise(function (resolve, reject) {
      _which(name, function (result) {
        if (result instanceof Error) return reject(result);
        resolve(result);
      });
    });
  }
}

function _which(name, cb) {
  try {
    (function () {
      if (!name) throw new Error('which requires a name argument');
      var isWin = _os2.default.platform() === 'win32';
      var child = (0, _crossSpawn2.default)(isWin ? 'where' : 'which', [name], { encoding: 'utf8' });
      var output = '';
      var pipe = child.stdout.pipe(new _FirstLineTransform2.default());
      var chunks = [];
      var timeoutMS = 5000;
      var timeoutID = setTimeout(function () {
        return cb(new Error('which timed out after ' + timeoutMS));
      }, timeoutMS);
      pipe.on('data', function (chunk) {
        if (chunk) output += chunk;
      });
      pipe.on('end', function () {
        clearTimeout(timeoutID);
        cb(output.length > 0 ? output : false);
      });
    })();
  } catch (err) {
    cb(err);
  }
}