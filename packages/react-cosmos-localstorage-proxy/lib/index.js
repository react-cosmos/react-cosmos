'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(
  _possibleConstructorReturn2
);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

exports.default = createLocalStorageProxy;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _react3 = require('react-cosmos-shared/lib/react');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

// Mocking localStorage completely ensures no conflict with existing browser
// data and works in test environments like Jest
var LocalStorageMock = (function() {
  function LocalStorageMock() {
    var store =
      arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var onUpdate = arguments[1];
    (0, _classCallCheck3.default)(this, LocalStorageMock);

    this.store = (0, _extends3.default)({}, store);
    this.onUpdate = onUpdate;
  }

  (0, _createClass3.default)(LocalStorageMock, [
    {
      key: 'clear',
      value: function clear() {
        this.store = {};
        this.update();
      }
    },
    {
      key: 'getItem',
      value: function getItem(key) {
        return this.store[key] || null;
      }
    },
    {
      key: 'setItem',
      value: function setItem(key, value) {
        this.store[key] = value.toString();
        this.update();
      }
    },
    {
      key: 'removeItem',
      value: function removeItem(key) {
        delete this.store[key];
        this.update();
      }
    },
    {
      key: 'update',
      value: function update() {
        this.onUpdate(this.store);
      }
    }
  ]);
  return LocalStorageMock;
})();

var defaults = {
  fixtureKey: 'localStorage'
};

function createLocalStorageProxy(options) {
  var _defaults$options = (0, _extends3.default)({}, defaults, options),
    fixtureKey = _defaults$options.fixtureKey;

  var LocalStorageProxy = (function(_Component) {
    (0, _inherits3.default)(LocalStorageProxy, _Component);

    function LocalStorageProxy(props) {
      (0, _classCallCheck3.default)(this, LocalStorageProxy);

      var _this = (0, _possibleConstructorReturn3.default)(
        this,
        (
          LocalStorageProxy.__proto__ ||
          Object.getPrototypeOf(LocalStorageProxy)
        ).call(this, props)
      );

      var mock = _this.props.fixture[fixtureKey];
      if (mock) {
        _this._localStorageOrig = global.localStorage;
        _this._localStorageMock = new LocalStorageMock(mock, function(
          updatedStore
        ) {
          _this.props.onFixtureUpdate({ localStorage: updatedStore });
        });

        Object.defineProperty(global, 'localStorage', {
          writable: true,
          value: _this._localStorageMock
        });
      }
      return _this;
    }

    (0, _createClass3.default)(LocalStorageProxy, [
      {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          // Make sure we don't clear a mock from a newer instance (in React 16
          //  B.constructor is called before A.componentWillUnmount)
          if (global.localStorage === this._localStorageMock) {
            global.localStorage = this._localStorageOrig;
          }
        }
      },
      {
        key: 'render',
        value: function render() {
          var _props$nextProxy = this.props.nextProxy,
            NextProxy = _props$nextProxy.value,
            next = _props$nextProxy.next;

          return _react2.default.createElement(
            NextProxy,
            (0, _extends3.default)({}, this.props, { nextProxy: next() })
          );
        }
      }
    ]);
    return LocalStorageProxy;
  })(_react.Component);

  LocalStorageProxy.propTypes = _react3.proxyPropTypes;

  return LocalStorageProxy;
}
