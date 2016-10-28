'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = syncify;
function syncify(fn, sync) {
  if (typeof fn !== 'function') throw new Error('syncify expects a function argument');
  if (typeof sync !== 'function') throw new Error('sync function must be a function');
  return Object.defineProperty(fn, 'sync', { value: sync, configurable: false, enumerable: true });
}