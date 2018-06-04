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

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _reactCosmosShared = require('react-cosmos-shared');

var _moduleType = require('../../utils/module-type');

var _moduleType2 = _interopRequireDefault(_moduleType);

var _PropsProxy = require('../PropsProxy');

var _PropsProxy2 = _interopRequireDefault(_PropsProxy);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var noope = function noope() {};

var createProxyLinkedList = function createProxyLinkedList(userProxies) {
  return (0, _reactCosmosShared.createLinkedList)(
    [].concat((0, _toConsumableArray3.default)(userProxies), [
      _PropsProxy2.default
    ])
  );
};

var Loader = (function(_Component) {
  (0, _inherits3.default)(Loader, _Component);

  /**
   * Loader for rendering React components in isolation.
   *
   * Renders components using fixtures and Proxy middleware. Initialized via
   * props.
   */
  function Loader(props) {
    (0, _classCallCheck3.default)(this, Loader);

    var _this = (0, _possibleConstructorReturn3.default)(
      this,
      (Loader.__proto__ || Object.getPrototypeOf(Loader)).call(this, props)
    );

    _this.firstProxy = createProxyLinkedList(props.proxies);
    return _this;
  }

  (0, _createClass3.default)(Loader, [
    {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(_ref) {
        var proxies = _ref.proxies;

        if (proxies !== this.props.proxies) {
          this.firstProxy = createProxyLinkedList(proxies);
        }
      }
    },
    {
      key: 'render',
      value: function render() {
        var firstProxy = this.firstProxy;
        var _props = this.props,
          fixture = _props.fixture,
          onComponentRef = _props.onComponentRef,
          onFixtureUpdate = _props.onFixtureUpdate;

        return _react2.default.createElement(firstProxy.value, {
          nextProxy: firstProxy.next(),
          fixture: fixture,
          onComponentRef: onComponentRef || noope,
          onFixtureUpdate: onFixtureUpdate || noope
        });
      }
    }
  ]);
  return Loader;
})(_react.Component);

Loader.propTypes = {
  fixture: (0, _moduleType2.default)(_propTypes.object).isRequired,
  proxies: (0, _propTypes.arrayOf)((0, _moduleType2.default)(_propTypes.func)),
  onComponentRef: _propTypes.func
};

Loader.defaultProps = {
  proxies: []
};

exports.default = Loader;
