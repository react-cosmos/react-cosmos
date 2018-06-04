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

exports.default = createXhrProxy;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _xhrMock = require('xhr-mock');

var _xhrMock2 = _interopRequireDefault(_xhrMock);

var _react3 = require('react-cosmos-shared/lib/react');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var defaults = {
  fixtureKey: 'xhr'
};

var mockDefaults = {
  method: 'get'
};

function createXhrProxy(options) {
  var _defaults$options = (0, _extends3.default)({}, defaults, options),
    fixtureKey = _defaults$options.fixtureKey;

  var XhrProxy = (function(_Component) {
    (0, _inherits3.default)(XhrProxy, _Component);

    function XhrProxy(props) {
      (0, _classCallCheck3.default)(this, XhrProxy);

      var _this = (0, _possibleConstructorReturn3.default)(
        this,
        (XhrProxy.__proto__ || Object.getPrototypeOf(XhrProxy)).call(
          this,
          props
        )
      );

      if (module.hot) {
        module.hot.status(function(status) {
          if (status === 'check') {
            _xhrMock2.default.teardown();
          }
        });
      }

      _this.mock();
      return _this;
    }

    (0, _createClass3.default)(XhrProxy, [
      {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          // Make sure we don't clear a mock from a newer instance (in React 16
          // B.constructor is called before A.componentWillUnmount)
          if (_xhrMock2.default.__prevProxy === this) {
            this.unmock();
          }
        }
      },
      {
        key: 'mock',
        value: function mock() {
          // Clear mocks from a previous FetchProxy instance
          // Warning: A page can only have one FetchProxy instance at the same time
          this.unmock();

          var mocks = this.props.fixture[fixtureKey];
          if (mocks) {
            _xhrMock2.default.setup();

            mocks.forEach(function(options) {
              var _mockDefaults$options = (0, _extends3.default)(
                  {},
                  mockDefaults,
                  options
                ),
                url = _mockDefaults$options.url,
                method = _mockDefaults$options.method,
                response = _mockDefaults$options.response;

              _xhrMock2.default[method.toLowerCase()](url, response);
            });
            _xhrMock2.default.__prevProxy = this;
          }
        }
      },
      {
        key: 'unmock',
        value: function unmock() {
          _xhrMock2.default.teardown();
        }
      },
      {
        key: 'render',
        value: function render() {
          var props = this.props;
          var nextProxy = props.nextProxy,
            onComponentRef = props.onComponentRef;

          return _react2.default.createElement(
            nextProxy.value,
            (0, _extends3.default)({}, props, {
              nextProxy: nextProxy.next(),
              onComponentRef: onComponentRef
            })
          );
        }
      }
    ]);
    return XhrProxy;
  })(_react.Component);

  XhrProxy.propTypes = _react3.proxyPropTypes;

  return XhrProxy;
}
