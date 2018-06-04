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

exports.default = createStateProxy;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _react3 = require('react-cosmos-shared/lib/react');

var _lodash = require('lodash.isequal');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.isempty');

var _lodash4 = _interopRequireDefault(_lodash3);

var _lodash5 = require('lodash.omit');

var _lodash6 = _interopRequireDefault(_lodash5);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var injectState = function injectState(component, state, cb) {
  var rootState = (0, _lodash6.default)(state, 'children');

  component.setState(rootState, function() {
    var children = state.children;

    if ((0, _lodash4.default)(children)) {
      cb();
      return;
    }

    var refs = component.refs;

    var promises = [];

    Object.keys(refs).forEach(function(ref) {
      var child = refs[ref];
      var childState = children[ref];

      if (!(0, _lodash4.default)(childState)) {
        promises.push(
          new Promise(function(resolve) {
            injectState(child, childState, resolve);
          })
        );
      }
    });

    if (promises.length === 0) {
      cb();
    } else {
      Promise.all(promises).then(cb);
    }
  });
};

var getState = function getState(component) {
  var state = component.state,
    refs = component.refs;

  if (!refs) {
    return state;
  }

  var children = {};

  Object.keys(refs).forEach(function(ref) {
    var child = refs[ref];
    var childState = getState(child);

    if (!(0, _lodash4.default)(childState)) {
      children[ref] = childState;
    }
  });

  if ((0, _lodash4.default)(children)) {
    return state;
  }

  return (0, _extends3.default)({}, state, {
    children: children
  });
};

var defaults = {
  fixtureKey: 'state',
  // How often to read current state of loaded component and report it up the
  // chain of proxies
  updateInterval: 500
};

function createStateProxy(options) {
  var _defaults$options = (0, _extends3.default)({}, defaults, options),
    fixtureKey = _defaults$options.fixtureKey,
    updateInterval = _defaults$options.updateInterval;

  var StateProxy = (function(_Component) {
    (0, _inherits3.default)(StateProxy, _Component);

    function StateProxy() {
      var _ref;

      var _temp, _this, _ret;

      (0, _classCallCheck3.default)(this, StateProxy);

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
            StateProxy.__proto__ ||
            Object.getPrototypeOf(StateProxy)).call.apply(
            _ref,
            [this].concat(args)
          )
        )),
        _this)),
        (_this.prevState = {}),
        (_this.onComponentRef = function(componentRef) {
          // Save component ref to be able to read its state later
          _this.componentRef = componentRef;

          var _this$props = _this.props,
            fixture = _this$props.fixture,
            onComponentRef = _this$props.onComponentRef,
            disableLocalState = _this$props.disableLocalState;

          // Ref callbacks are also called on unmount with null value

          if (componentRef) {
            if (disableLocalState) {
              // Bubble up component ref
              onComponentRef(componentRef);
            } else {
              // Load initial state right after component renders
              var fixtureState = fixture[fixtureKey];
              if (fixtureState) {
                injectState(componentRef, fixtureState, function() {
                  // Bubble up component ref after state has been injected
                  onComponentRef(componentRef);

                  _this.prevState = fixtureState;
                  _this.scheduleStateUpdate();
                });
              } else {
                // Bubble up component ref
                onComponentRef(componentRef);

                // Only poll for state changes if component has state
                var initialState = getState(componentRef);
                if (initialState) {
                  _this.updateState(initialState);
                }
              }
            }
          } else {
            // Bubble up null component ref
            onComponentRef(componentRef);

            _this.clearTimeout();
          }
        }),
        (_this.onStateUpdate = function() {
          _this.updateState(getState(_this.componentRef));
        }),
        _temp)),
        (0, _possibleConstructorReturn3.default)(_this, _ret)
      );
    }

    (0, _createClass3.default)(StateProxy, [
      {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          this.clearTimeout();
        }
      },
      {
        key: 'updateState',
        value: function updateState(updatedState) {
          var onFixtureUpdate = this.props.onFixtureUpdate;

          if (!(0, _lodash2.default)(updatedState, this.prevState)) {
            this.prevState = updatedState;

            onFixtureUpdate({
              state: updatedState
            });
          }

          this.scheduleStateUpdate();
        }
      },
      {
        key: 'scheduleStateUpdate',
        value: function scheduleStateUpdate() {
          // TODO: Find a better way than polling to hook into state changes
          this.timeoutId = setTimeout(this.onStateUpdate, updateInterval);
        }
      },
      {
        key: 'clearTimeout',
        value: (function(_clearTimeout) {
          function clearTimeout() {
            return _clearTimeout.apply(this, arguments);
          }

          clearTimeout.toString = function() {
            return _clearTimeout.toString();
          };

          return clearTimeout;
        })(function() {
          clearTimeout(this.timeoutId);
        })
      },
      {
        key: 'render',
        value: function render() {
          var props = this.props,
            onComponentRef = this.onComponentRef;
          var nextProxy = props.nextProxy;

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
    return StateProxy;
  })(_react.Component);

  StateProxy.defaultProps = {
    // Parent proxies can enable this flag to disable this proxy
    disableLocalState: false
  };

  StateProxy.propTypes = (0, _extends3.default)({}, _react3.proxyPropTypes, {
    disableLocalState: _propTypes.bool
  });

  return StateProxy;
}
