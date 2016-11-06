'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.api = api;
exports.default = cross;

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _dos2unix = require('@raider/dos2unix');

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function api(args, opts, cb) {
  var _args = _slicedToArray(args, 1),
      path = _args[0];

  return cross(path, cb);
}

function cross() {
  var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : process.cwd();
  var cb = arguments[1];

  if (cb) {
    _cross(path, cb);
  } else {
    return new Promise(function (resolve, reject) {
      _cross(path, function (result) {
        if (result instanceof Error) return reject(result);
        resolve(result);
      });
    });
  }
}

function _cross(path, cb) {
  try {
    // Create a new `dos2unix` instance and add important event listeners
    var d2u = new _dos2unix.dos2unix({ glob: { cwd: path }, maxConcurrency: 50 }).on('error', function (err) {
      cb(err);
    }).on('end', function (stats) {
      console.log(stats);
      cb();
    });
    d2u.process(['**/*']);
  } catch (err) {
    cb(err);
  }
}