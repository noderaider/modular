'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _stream = require('stream');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FirstLineTransform = function (_Transform) {
  _inherits(FirstLineTransform, _Transform);

  function FirstLineTransform() {
    _classCallCheck(this, FirstLineTransform);

    var _this = _possibleConstructorReturn(this, (FirstLineTransform.__proto__ || Object.getPrototypeOf(FirstLineTransform)).call(this, {}));

    _this.isFinished = false;
    return _this;
  }

  _createClass(FirstLineTransform, [{
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

  return FirstLineTransform;
}(_stream.Transform);

exports.default = FirstLineTransform;