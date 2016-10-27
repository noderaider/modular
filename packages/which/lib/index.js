'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.api = api;
exports.default = which;

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _crossSpawn = require('cross-spawn');

var _crossSpawn2 = _interopRequireDefault(_crossSpawn);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _stream = require('stream');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function api(args, opts, cb) {
  if (args.length !== 1) throw new Error('which requires exactly 1 argument name (and a callback for api)');

  var _args = _slicedToArray(args, 1),
      name = _args[0];

  return which(name, cb);
}

function which(name, cb) {
  if (cb) {
    _which(name, cb);
  } else {
    return new Promise(function (resolve, reject) {
      _which(name, function (result) {
        if (result instanceof Error) return reject(result);
        resolve(result);
      });
    });
  }
}

function _which(name, cb) {
  try {
    (function () {
      if (!name) throw new Error('which requires a name argument');
      var isWin = _os2.default.platform() === 'win32';
      var child = (0, _crossSpawn2.default)(isWin ? 'where' : 'whereis', isWin ? [name] : [name], { encoding: 'utf8' });
      var output = '';
      var filtered = child.stdout.pipe(new FirstLineStream());
      var chunks = [];
      filtered.on('data', function (chunk) {
        if (chunk) output += chunk;
      });
      filtered.on('end', function () {
        return cb(output.length > 0 ? output : false);
      });
    })();
  } catch (err) {
    cb(err);
  }
}

var FirstLineStream = function (_Transform) {
  _inherits(FirstLineStream, _Transform);

  function FirstLineStream() {
    _classCallCheck(this, FirstLineStream);

    var _this = _possibleConstructorReturn(this, (FirstLineStream.__proto__ || Object.getPrototypeOf(FirstLineStream)).call(this, {}));

    _this.isFinished = false;
    return _this;
  }

  _createClass(FirstLineStream, [{
    key: '_transform',
    value: function _transform(chunk, encoding, next) {
      if (this.isFinished) return next();
      var str = chunk.toString('utf8');
      if (str.includes('\n')) {
        var _str$split = str.split('\n'),
            _str$split2 = _slicedToArray(_str$split, 1),
            final = _str$split2[0];

        this.push(final);
        this.isFinished = true;
      } else {
        this.push(str);
      }
      next();
    }
  }]);

  return FirstLineStream;
}(_stream.Transform);