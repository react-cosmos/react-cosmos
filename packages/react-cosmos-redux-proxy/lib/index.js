'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

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

exports.default = createReduxProxy;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _react3 = require('react-cosmos-shared/lib/react');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var defaults = {
  fixtureKey: 'reduxState',
  alwaysCreateStore: false,
  disableLocalState: true
};

function createReduxProxy(options) {
  var _defaults$options = (0, _extends3.default)({}, defaults, options),
    fixtureKey = _defaults$options.fixtureKey,
    createStore = _defaults$options.createStore,
    alwaysCreateStore = _defaults$options.alwaysCreateStore,
    disableLocalState = _defaults$options.disableLocalState;

  var ReduxProxy = (function(_React$Component) {
    (0, _inherits3.default)(ReduxProxy, _React$Component);

    function ReduxProxy(props) {
      (0, _classCallCheck3.default)(this, ReduxProxy);

      var _this = (0, _possibleConstructorReturn3.default)(
        this,
        (ReduxProxy.__proto__ || Object.getPrototypeOf(ReduxProxy)).call(
          this,
          props
        )
      );

      _this.onStoreChange = _this.onStoreChange.bind(_this);

      var fixtureReduxState = props.fixture[fixtureKey];
      if (alwaysCreateStore || fixtureReduxState) {
        _this.store = createStore(fixtureReduxState);
      }
      return _this;
    }

    (0, _createClass3.default)(ReduxProxy, [
      {
        key: 'getChildContext',
        value: function getChildContext() {
          return {
            store: this.store
          };
        }
      },
      {
        key: 'componentWillMount',
        value: function componentWillMount() {
          var store = this.store,
            onStoreChange = this.onStoreChange;

          if (store) {
            this.storeUnsubscribe = store.subscribe(onStoreChange);
          }
        }
      },
      {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          if (this.storeUnsubscribe) {
            this.storeUnsubscribe();
          }
        }
      },
      {
        key: 'onStoreChange',
        value: function onStoreChange() {
          var onFixtureUpdate = this.props.onFixtureUpdate;

          var updatedState = this.store.getState();

          onFixtureUpdate(
            (0, _defineProperty3.default)({}, fixtureKey, updatedState)
          );
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
              onComponentRef: onComponentRef,
              // Disable StateProxy when Redux state is available, otherwise the entire
              // Redux store would be duplicated from the connect() component's state
              disableLocalState: disableLocalState && Boolean(this.store)
            })
          );
        }
      }
    ]);
    return ReduxProxy;
  })(_react2.default.Component);

  ReduxProxy.propTypes = _react3.proxyPropTypes;

  ReduxProxy.childContextTypes = {
    store: _propTypes.object
  };

  return ReduxProxy;
}
