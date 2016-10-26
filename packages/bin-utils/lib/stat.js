'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bluebird = require('bluebird');

exports.default = (0, _bluebird.promisify)(require('graceful-fs').stat);