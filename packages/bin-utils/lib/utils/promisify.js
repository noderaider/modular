'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.default = promisify;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function promisify(fn) {
  var promisified = function promisified() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return new _promise2.default(function (resolve, reject) {
      try {
        fn.apply(undefined, args.concat([function () {
          if ((arguments.length <= 0 ? undefined : arguments[0]) instanceof Error) reject(arguments.length <= 0 ? undefined : arguments[0]);else resolve.apply(undefined, arguments);
        }]));
      } catch (err) {
        reject(err);
      }
    });
  };
  return function promiseWrap() {
    var _ref;

    return typeof (_ref = arguments.length - 1, arguments.length <= _ref ? undefined : arguments[_ref]) === 'function' ? fn.apply(undefined, arguments) : promisified.apply(undefined, arguments);
  };
}