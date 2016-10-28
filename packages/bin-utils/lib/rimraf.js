'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _utils.syncify)((0, _utils.promisify)(_rimraf2.default), _rimraf2.default.sync);