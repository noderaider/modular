'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _utils.syncify)((0, _utils.promisify)(_mkdirp2.default), _mkdirp2.default.sync);