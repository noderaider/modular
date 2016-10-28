'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ncp = require('ncp');

var _ncp2 = _interopRequireDefault(_ncp);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _utils.promisify)(_ncp2.default);