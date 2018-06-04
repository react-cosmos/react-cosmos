'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _reactRouter = require('react-router');

var _react3 = require('react-cosmos-shared/lib/react');

var _LocationInterceptor = require('./LocationInterceptor');

var _LocationInterceptor2 = _interopRequireDefault(_LocationInterceptor);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function buildLocation(url, locationState) {
  var _urlParser$parse = _url2.default.parse(url),
    pathname = _urlParser$parse.pathname,
    search = _urlParser$parse.search,
    hash = _urlParser$parse.hash;

  return {
    pathname: pathname,
    search: search,
    hash: hash,
    key: 'mocked',
    state: locationState
  };
}

exports.default = function() {
  var RouterProxy = function RouterProxy(props) {
    var nextProxy = props.nextProxy,
      fixture = props.fixture,
      onFixtureUpdate = props.onFixtureUpdate;
    var NextProxy = nextProxy.value,
      next = nextProxy.next;
    var route = fixture.route,
      url = fixture.url,
      locationState = fixture.locationState;

    var nextProxyEl = _react2.default.createElement(
      NextProxy,
      (0, _extends3.default)({}, props, { nextProxy: next() })
    );

    if (locationState && !url) {
      throw new Error('Must provide a url in fixture to use locationState');
    }

    if (!url) {
      return nextProxyEl;
    }

    var handleUrlChange = function handleUrlChange(url) {
      onFixtureUpdate({ url: url });
    };

    var handleLocationStateChange = function handleLocationStateChange(
      locationState
    ) {
      onFixtureUpdate({ locationState: locationState });
    };

    var location = buildLocation(url, locationState);

    return _react2.default.createElement(
      _reactRouter.MemoryRouter,
      { initialEntries: [location] },
      _react2.default.createElement(
        _LocationInterceptor2.default,
        {
          onUrlChange: handleUrlChange,
          onLocationStateChange: handleLocationStateChange
        },
        route
          ? _react2.default.createElement(_reactRouter.Route, {
              path: route,
              render: function render() {
                return nextProxyEl;
              }
            })
          : nextProxyEl
      )
    );
  };

  RouterProxy.propTypes = (0, _extends3.default)({}, _react3.proxyPropTypes, {
    route: _propTypes.string,
    url: _propTypes.string,
    locationState: _propTypes.any
  });

  return RouterProxy;
};
