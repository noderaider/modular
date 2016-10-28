'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promisify = require('./promisify');

Object.defineProperty(exports, 'promisify', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_promisify).default;
  }
});

var _syncify = require('./syncify');

Object.defineProperty(exports, 'syncify', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_syncify).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }