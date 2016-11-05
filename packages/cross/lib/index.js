'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.api = api;
exports.default = cross;

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _dos2unix = require('dos2unix');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function api(args, opts, cb) {
  return cross(cb);
}

function cross(cb) {
  if (cb) {
    _cross(cb);
  } else {
    return new Promise(function (resolve, reject) {
      _cross(function (result) {
        if (result instanceof Error) return reject(result);
        resolve(result);
      });
    });
  }
}

function _cross(cb) {
  try {
    var D2UConverter = (0, _dos2unix.dos2unix)();
    var defaultOptions = { glob: { cwd: __dirname }, maxConcurrency: 50 };

    // Create a new `dos2unix` instance and add important event listeners
    var d2u = new D2UConverter(defaultOptions).on('error', function (err) {
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