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

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _isComponentClass = require('../../utils/is-component-class');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var PropsProxy = (function(_Component) {
  (0, _inherits3.default)(PropsProxy, _Component);

  function PropsProxy() {
    (0, _classCallCheck3.default)(this, PropsProxy);
    return (0, _possibleConstructorReturn3.default)(
      this,
      (PropsProxy.__proto__ || Object.getPrototypeOf(PropsProxy)).apply(
        this,
        arguments
      )
    );
  }

  (0, _createClass3.default)(PropsProxy, [
    {
      key: 'render',

      /**
       * The final proxy in the chain that renders the selected component.
       */
      value: function render() {
        var _props = this.props,
          _props$fixture = _props.fixture,
          C = _props$fixture.component,
          props = _props$fixture.props,
          fixtureChildren = _props$fixture.children,
          onComponentRef = _props.onComponentRef;

        // Legacy versions of react-cosmos supported specifying children
        // directly on the fixture, rather than in fixture.props

        var finalProps = (0, _extends3.default)(
          { children: fixtureChildren },
          props
        );

        // Stateless components can't have refs
        return (0, _isComponentClass.isComponentClass)(C)
          ? _react2.default.createElement(
              C,
              (0, _extends3.default)({}, finalProps, { ref: onComponentRef })
            )
          : _react2.default.createElement(C, finalProps);
      }
    }
  ]);
  return PropsProxy;
})(_react.Component);

exports.default = PropsProxy;

PropsProxy.propTypes = {
  fixture: _propTypes.object.isRequired,
  onComponentRef: _propTypes.func.isRequired
};
