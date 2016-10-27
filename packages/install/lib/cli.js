'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = cli;

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _2 = require('../');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function cli() {
  var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (err) {
    if (!err) return;
    console.error('error occurred during execution => ' + _util2.default.inspect(err));
    process.exit(1);
  };

  var packageJson = require('../package.json');
  var argv = _yargs2.default.usage('Usage: ' + packageJson.name + ' <project-directory> [options]\nversion: ' + packageJson.version).describe('verbose', 'Print debugging information.').help('h').alias('h', 'help').argv;

  var _ = argv._,
      _opts = _objectWithoutProperties(argv, ['_']);

  return (0, _2.api)(_, _opts, cb);
}