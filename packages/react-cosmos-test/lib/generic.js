'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.createContext = createContext;

var _traverse = require('traverse');

var _traverse2 = _interopRequireDefault(_traverse);

var _reactCosmosShared = require('react-cosmos-shared');

var _server = require('react-cosmos-shared/lib/server');

var _reactCosmosConfig = require('react-cosmos-config');

var _reactCosmosLoader = require('react-cosmos-loader');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function createContext(args) {
  var fixture = args.fixture,
    _args$proxies = args.proxies,
    proxies =
      _args$proxies === undefined
        ? detectUserProxies(args.cosmosConfigPath)
        : _args$proxies;

  var decoratedFixture = decorateFixture(fixture);

  return (0, _reactCosmosLoader.createContext)(
    (0, _extends3.default)({}, args, {
      proxies: proxies,
      fixture: decoratedFixture
    })
  );
}

function detectUserProxies(cosmosConfigPath) {
  var cosmosConfig = (0, _reactCosmosConfig.getCosmosConfig)(cosmosConfigPath);
  var proxiesPath = cosmosConfig.proxiesPath;

  var userProxies = (0, _server.moduleExists)(proxiesPath)
    ? (0, _reactCosmosShared.importModule)(require(proxiesPath))
    : [];

  return userProxies;
}

function decorateFixture(fixture) {
  if (!inJestEnv() || !fixture.props) {
    return fixture;
  }

  return (0, _extends3.default)({}, fixture, {
    props: _traverse2.default.map(fixture.props, addJestWrapper)
  });
}

function inJestEnv() {
  try {
    jest.fn(); // eslint-disable-line no-undef
    return true;
  } catch (err) {
    return false;
  }
}

function addJestWrapper(prop) {
  // HIGHLY EXPERIMENTAL: This is likely to go away if it causes problems. But,
  // in the meantime, as Louie would say, "Weeeee!". This makes it possible to
  // do expect(fixture.props.*).toHaveBeenCalled in Jest without wrapping any
  // callback with jest.fn() by had.
  // eslint-disable-next-line no-undef
  return isFunctionButNotClass(prop) ? jest.fn(prop) : prop;
}

function isFunctionButNotClass(prop) {
  // Inspired from https://stackoverflow.com/a/32235930
  return (
    typeof prop === 'function' &&
    !/^(?:class\s+|function\s+(?:_class|_default|[A-Z]))/.test(prop.toString())
  );
}
