'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = shouldUseYarn;

var _which = require('@raider/which');

var _which2 = _interopRequireDefault(_which);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function shouldUseYarn() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      yarn = _ref.yarn,
      npm = _ref.npm;

  var cb = arguments[1];

  if (yarn && npm) throw new Error('you must choose between yarn or npm or let the best choice be autodetected.');
  if (npm) cb(false);else if (yarn) cb(true);else (0, _which2.default)('yarn', cb);
}