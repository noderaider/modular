'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _gracefulFs = require('graceful-fs');

var _gracefulFs2 = _interopRequireDefault(_gracefulFs);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _utils.syncify)((0, _utils.promisify)(_gracefulFs2.default.stat), _gracefulFs2.default.statSync);