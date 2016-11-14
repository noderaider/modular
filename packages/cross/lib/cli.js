'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = cli;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _2 = require('../');

var _cliPrompt = require('cli-prompt');

var _cliPrompt2 = _interopRequireDefault(_cliPrompt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function cli() {
  var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (result) {
    if (result instanceof Error) {
      console.error('error occurred during execution => ' + _util2.default.inspect(result));
      process.exit(1);
    } else if (result === false || result.length === 0) {
      process.exit(1);
    }
    console.log(result);
  };

  var packageJson = require('../package.json');
  var name = packageJson.name.includes('/') ? packageJson.name.split('/')[1] : packageJson.name;
  var argv = _yargs2.default.usage(_chalk2.default.green.bold('Usage: ' + name + ' [repo/path] [options]')).version(packageJson.version).describe('verbose', 'Print debugging information.').help('h').alias('h', 'help').argv;

  var _ = argv._,
      opts = _objectWithoutProperties(argv, ['_']);

  var _ref = _slicedToArray(_, 1),
      _ref$ = _ref[0],
      _path = _ref$ === undefined ? process.cwd() : _ref$;

  (0, _cliPrompt2.default)(packageJson.name + ' will upgrade ' + _chalk2.default.cyan(_path) + ' recursively => proceed? [' + _chalk2.default.green('y') + _chalk2.default.red('N') + ']', function (val) {
    if (val === 'y') {
      (0, _2.api)([_path], opts, cb);
    } else {
      console.log('\u270C');
      process.exit(0);
    }
  }, function (err) {
    console.error(err);
    process.exit(1);
  });
}