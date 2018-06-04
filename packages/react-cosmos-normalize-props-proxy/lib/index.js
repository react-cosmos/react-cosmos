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

exports.default = createNormalizePropsProxy;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _react3 = require('react-cosmos-shared/lib/react');

var _lodash = require('lodash.omit');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.pick');

var _lodash4 = _interopRequireDefault(_lodash3);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var defaults = {
  notProps: ['component', 'children', 'state', 'context', 'reduxState']
};

var getFixedFixture = function getFixedFixture(fixture, notProps) {
  if (fixture.props) {
    // Proxy does not support partially upgraded fixture
    return fixture;
  }

  return (0, _extends3.default)({}, (0, _lodash4.default)(fixture, notProps), {
    props: (0, _lodash2.default)(fixture, notProps)
  });
};

function createNormalizePropsProxy(options) {
  var _defaults$options = (0, _extends3.default)({}, defaults, options),
    notProps = _defaults$options.notProps;

  var NormalizePropsProxy = (function(_React$Component) {
    (0, _inherits3.default)(NormalizePropsProxy, _React$Component);

    function NormalizePropsProxy() {
      (0, _classCallCheck3.default)(this, NormalizePropsProxy);
      return (0, _possibleConstructorReturn3.default)(
        this,
        (
          NormalizePropsProxy.__proto__ ||
          Object.getPrototypeOf(NormalizePropsProxy)
        ).apply(this, arguments)
      );
    }

    (0, _createClass3.default)(NormalizePropsProxy, [
      {
        key: 'render',
        value: function render() {
          var _props = this.props,
            nextProxy = _props.nextProxy,
            fixture = _props.fixture;

          return _react2.default.createElement(
            nextProxy.value,
            (0, _extends3.default)({}, this.props, {
              nextProxy: nextProxy.next(),
              fixture: getFixedFixture(fixture, notProps)
            })
          );
        }
      }
    ]);
    return NormalizePropsProxy;
  })(_react2.default.Component);

  NormalizePropsProxy.propTypes = _react3.proxyPropTypes;

  return NormalizePropsProxy;
}
