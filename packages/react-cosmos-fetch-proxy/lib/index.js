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

exports.default = createFetchProxy;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _fetchMock = require('fetch-mock');

var _fetchMock2 = _interopRequireDefault(_fetchMock);

var _react3 = require('react-cosmos-shared/lib/react');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var defaults = {
  fixtureKey: 'fetch'
};

function createFetchProxy(options) {
  var _defaults$options = (0, _extends3.default)({}, defaults, options),
    fixtureKey = _defaults$options.fixtureKey;

  var FetchProxy = (function(_Component) {
    (0, _inherits3.default)(FetchProxy, _Component);

    function FetchProxy(props) {
      (0, _classCallCheck3.default)(this, FetchProxy);

      var _this = (0, _possibleConstructorReturn3.default)(
        this,
        (FetchProxy.__proto__ || Object.getPrototypeOf(FetchProxy)).call(
          this,
          props
        )
      );

      _this.mock();
      return _this;
    }

    (0, _createClass3.default)(FetchProxy, [
      {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          // Make sure we don't clear a mock from a newer instance (in React 16
          // B.constructor is called before A.componentWillUnmount)
          if (_fetchMock2.default.__prevProxy === this) {
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
            mocks.forEach(function(options) {
              _fetchMock2.default.mock(options);
            });

            // Allow unmocked requests to fall through
            // eslint-disable-next-line unicorn/catch-error-name
            _fetchMock2.default.catch(function() {
              for (
                var _len = arguments.length, args = Array(_len), _key = 0;
                _key < _len;
                _key++
              ) {
                args[_key] = arguments[_key];
              }

              return _fetchMock2.default.realFetch.apply(window, args);
            });

            _fetchMock2.default.__prevProxy = this;
          }
        }
      },
      {
        key: 'unmock',
        value: function unmock() {
          if (typeof _fetchMock2.default.restore === 'function') {
            _fetchMock2.default.restore();
            delete _fetchMock2.default.__prevProxy;
          }
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
    return FetchProxy;
  })(_react.Component);

  FetchProxy.propTypes = _react3.proxyPropTypes;

  return FetchProxy;
}
