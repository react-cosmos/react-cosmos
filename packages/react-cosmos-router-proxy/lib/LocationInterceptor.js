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

var _react = require('react');

var _reactRouter = require('react-router');

var _propTypes = require('prop-types');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var getUrlFromLocation = function getUrlFromLocation(_ref) {
  var pathname = _ref.pathname,
    search = _ref.search,
    hash = _ref.hash;
  return '' + pathname + search + hash;
};

var LocationInterceptor = (function(_Component) {
  (0, _inherits3.default)(LocationInterceptor, _Component);

  function LocationInterceptor() {
    (0, _classCallCheck3.default)(this, LocationInterceptor);
    return (0, _possibleConstructorReturn3.default)(
      this,
      (
        LocationInterceptor.__proto__ ||
        Object.getPrototypeOf(LocationInterceptor)
      ).apply(this, arguments)
    );
  }

  (0, _createClass3.default)(LocationInterceptor, [
    {
      key: 'componentDidUpdate',
      value: function componentDidUpdate(prevProps) {
        var _props = this.props,
          location = _props.location,
          onUrlChange = _props.onUrlChange,
          onLocationStateChange = _props.onLocationStateChange;

        var newUrl = getUrlFromLocation(location);
        if (newUrl !== getUrlFromLocation(prevProps.location)) {
          onUrlChange(newUrl);
        }
        if (
          JSON.stringify(location.state) !==
          JSON.stringify(prevProps.location.state)
        ) {
          onLocationStateChange(location.state);
        }
      }
    },
    {
      key: 'render',
      value: function render() {
        return this.props.children;
      }
    }
  ]);
  return LocationInterceptor;
})(_react.Component);

LocationInterceptor.contextTypes = {
  router: _propTypes.object
};
exports.default = (0, _reactRouter.withRouter)(LocationInterceptor);
