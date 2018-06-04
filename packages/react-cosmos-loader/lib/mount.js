'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

exports.mount = mount;

var _reactCosmosStateProxy = require('react-cosmos-state-proxy');

var _reactCosmosStateProxy2 = _interopRequireDefault(_reactCosmosStateProxy);

var _ErrorCatchProxy = require('./components/ErrorCatchProxy');

var _ErrorCatchProxy2 = _interopRequireDefault(_ErrorCatchProxy);

var _domRenderer = require('./dom-renderer');

var _connectLoader = require('./connect-loader');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var StateProxy = void 0;
var ErrorCatchProxy = void 0;

function mount(args) {
  var proxies = args.proxies,
    fixtures = args.fixtures,
    loaderOpts = args.loaderOpts,
    dismissRuntimeErrors = args.dismissRuntimeErrors;

  var renderer = (0, _domRenderer.createDomRenderer)(loaderOpts);

  // Reuse proxy instances
  if (!StateProxy) {
    StateProxy = (0, _reactCosmosStateProxy2.default)();
    ErrorCatchProxy = (0, _ErrorCatchProxy2.default)();
  }

  (0, _connectLoader.connectLoader)({
    renderer: renderer,
    proxies: [ErrorCatchProxy].concat(
      (0, _toConsumableArray3.default)(proxies),
      [StateProxy]
    ),
    fixtures: fixtures,
    dismissRuntimeErrors: dismissRuntimeErrors
  });
}
