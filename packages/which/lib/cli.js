'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = cli;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _2 = require('../');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function cli() {
  var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (result) {
    if (result instanceof Error) {
      console.error('error occurred during execution => ' + _util2.default.inspect(err));
      process.exit(1);
    } else if (result === false || result.length === 0) {
      process.exit(1);
    }
    console.log(result);
  };

  var packageJson = require('../package.json');
  var name = packageJson.name.includes('/') ? packageJson.name.split('/')[1] : packageJson.name;
  var argv = _yargs2.default.usage(_chalk2.default.green.bold('Usage: ' + name + ' <executable> [options]')).version(packageJson.version).describe('verbose', 'Print debugging information.').help('h').alias('h', 'help').demand(1).argv;

  var _ = argv._,
      opts = _objectWithoutProperties(argv, ['_']);

  return (0, _2.api)(_, opts, cb);
}