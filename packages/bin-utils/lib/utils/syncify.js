'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = syncify;
function syncify(fn, sync) {
  if (typeof fn !== 'function') throw new Error('syncify expects a function argument');
  if (sync && typeof sync !== 'function') throw new Error('Optional sync function must be a function');
  return Object.defineProperty(fn, 'sync', { value: sync ? sync : require('deasync')(fn), configurable: false, enumerable: true });
}