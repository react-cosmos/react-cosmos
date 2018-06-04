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

exports.default = createApolloProxy;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _graphqlTools = require('graphql-tools');

var _graphql = require('graphql');

var _reactApollo = require('react-apollo');

var _react3 = require('react-cosmos-shared/lib/react');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var defaults = {
  // Must provide schema definition with query type or a type named Query.
  typeDefs: 'type Query { hello: String }',
  context: {},
  rootValue: {}
};

function createApolloProxy(options) {
  var _defaults$options = (0, _extends3.default)({}, defaults, options),
    typeDefs = _defaults$options.typeDefs,
    mocks = _defaults$options.mocks,
    context = _defaults$options.context,
    rootValue = _defaults$options.rootValue;

  var schema = (0, _graphqlTools.makeExecutableSchema)({ typeDefs: typeDefs });

  if (mocks) {
    (0, _graphqlTools.addMockFunctionsToSchema)({
      schema: schema,
      mocks: mocks
    });
  }

  var ApolloProxy = (function(_Component) {
    (0, _inherits3.default)(ApolloProxy, _Component);

    function ApolloProxy(props) {
      (0, _classCallCheck3.default)(this, ApolloProxy);

      var _this = (0, _possibleConstructorReturn3.default)(
        this,
        (ApolloProxy.__proto__ || Object.getPrototypeOf(ApolloProxy)).call(
          this,
          props
        )
      );

      _this.client = new _reactApollo.ApolloClient({
        networkInterface: {
          query: function query(request) {
            return (0, _graphql.graphql)(
              schema,
              (0, _graphql.print)(request.query),
              rootValue,
              context,
              request.variables,
              request.operationName
            );
          }
        }
      });
      return _this;
    }

    (0, _createClass3.default)(ApolloProxy, [
      {
        key: 'render',
        value: function render() {
          var _props$nextProxy = this.props.nextProxy,
            NextProxy = _props$nextProxy.value,
            next = _props$nextProxy.next;

          return _react2.default.createElement(
            _reactApollo.ApolloProvider,
            { client: this.client },
            _react2.default.createElement(
              NextProxy,
              (0, _extends3.default)({}, this.props, { nextProxy: next() })
            )
          );
        }
      }
    ]);
    return ApolloProxy;
  })(_react.Component);

  ApolloProxy.propTypes = _react3.proxyPropTypes;

  return ApolloProxy;
}
