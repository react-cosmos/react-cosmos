'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(
  _possibleConstructorReturn2
);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

exports.default = createErrorCatchProxy;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styles = require('./styles');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

// Returning a class creator to be consistent with the other proxies and to be
// able to add options in the future without breaking API
function createErrorCatchProxy() {
  var ErrorCatchProxy = (function(_Component) {
    (0, _inherits3.default)(ErrorCatchProxy, _Component);

    function ErrorCatchProxy() {
      var _ref;

      var _temp, _this, _ret;

      (0, _classCallCheck3.default)(this, ErrorCatchProxy);

      for (
        var _len = arguments.length, args = Array(_len), _key = 0;
        _key < _len;
        _key++
      ) {
        args[_key] = arguments[_key];
      }

      return (
        (_ret = ((_temp = ((_this = (0, _possibleConstructorReturn3.default)(
          this,
          (_ref =
            ErrorCatchProxy.__proto__ ||
            Object.getPrototypeOf(ErrorCatchProxy)).call.apply(
            _ref,
            [this].concat(args)
          )
        )),
        _this)),
        (_this.state = {
          hasError: false,
          errorMessage: ''
        }),
        _temp)),
        (0, _possibleConstructorReturn3.default)(_this, _ret)
      );
    }

    (0, _createClass3.default)(ErrorCatchProxy, [
      {
        key: 'componentDidCatch',
        value: function componentDidCatch(error, info) {
          console.log(error, info);
          this.setState({ hasError: true, errorMessage: error.message });
        }
      },
      {
        key: 'render',
        value: function render() {
          return this.state.hasError
            ? this.renderError()
            : this.renderNextProxy();
        }
      },
      {
        key: 'renderError',
        value: function renderError() {
          return _react2.default.createElement(
            'div',
            { style: _styles.rootStyles },
            _react2.default.createElement(
              'div',
              null,
              _react2.default.createElement(
                'strong',
                null,
                'Ouch, something wrong!'
              )
            ),
            _react2.default.createElement(
              'div',
              null,
              _react2.default.createElement(
                'pre',
                { style: _styles.codeStyles },
                this.state.errorMessage
              )
            ),
            _react2.default.createElement(
              'div',
              null,
              'Check console for more info.'
            )
          );
        }
      },
      {
        key: 'renderNextProxy',
        value: function renderNextProxy() {
          var nextProxy = this.props.nextProxy;

          return _react2.default.createElement(
            nextProxy.value,
            (0, _extends3.default)({}, this.props, {
              nextProxy: nextProxy.next()
            })
          );
        }
      }
    ]);
    return ErrorCatchProxy;
  })(_react.Component);

  return ErrorCatchProxy;
}
