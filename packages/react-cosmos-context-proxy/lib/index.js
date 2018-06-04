'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

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

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.default = createContextProxy;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _react3 = require('react-cosmos-shared/lib/react');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var defaults = {
  fixtureKey: 'context'
};

function createContextProxy(options) {
  var _defaults$options = (0, _extends3.default)({}, defaults, options),
    fixtureKey = _defaults$options.fixtureKey,
    childContextTypes = _defaults$options.childContextTypes;

  var ContextProxy = (function(_React$Component) {
    (0, _inherits3.default)(ContextProxy, _React$Component);

    function ContextProxy() {
      (0, _classCallCheck3.default)(this, ContextProxy);
      return (0, _possibleConstructorReturn3.default)(
        this,
        (ContextProxy.__proto__ || Object.getPrototypeOf(ContextProxy)).apply(
          this,
          arguments
        )
      );
    }

    (0, _createClass3.default)(ContextProxy, [
      {
        key: 'getChildContext',
        value: function getChildContext() {
          return this.props.fixture[fixtureKey] || {};
        }
      },
      {
        key: 'render',
        value: function render() {
          var _props = this.props,
            nextProxy = _props.nextProxy,
            fixture = _props.fixture,
            onComponentRef = _props.onComponentRef;

          return _react2.default.createElement(
            nextProxy.value,
            (0, _extends3.default)({}, this.props, {
              nextProxy: nextProxy.next(),
              fixture: fixture,
              onComponentRef: onComponentRef
            })
          );
        }
      }
    ]);
    return ContextProxy;
  })(_react2.default.Component);

  ContextProxy.propTypes = _react3.proxyPropTypes;

  ContextProxy.childContextTypes = childContextTypes;

  return ContextProxy;
}
