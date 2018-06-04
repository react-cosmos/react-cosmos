'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _reactTestRenderer = require('react-test-renderer');

var _reactCosmosStateProxy = require('react-cosmos-state-proxy');

var _reactCosmosStateProxy2 = _interopRequireDefault(_reactCosmosStateProxy);

var _reactCosmosShared = require('react-cosmos-shared');

var _server = require('react-cosmos-shared/lib/server');

var _reactCosmosConfig = require('react-cosmos-config');

var _server2 = require('react-cosmos-voyager2/lib/server');

var _client = require('react-cosmos-voyager2/lib/client');

var _reactCosmosLoader = require('react-cosmos-loader');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

exports.default = (0, _asyncToGenerator3.default)(
  /*#__PURE__*/ _regenerator2.default.mark(function _callee2() {
    var _ref2 =
        arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      cosmosConfigPath = _ref2.cosmosConfigPath;

    var cosmosConfig,
      rootPath,
      proxiesPath,
      fileMatch,
      exclude,
      componentPaths,
      userProxies,
      proxies;
    return _regenerator2.default.wrap(
      function _callee2$(_context2) {
        while (1) {
          switch ((_context2.prev = _context2.next)) {
            case 0:
              cosmosConfig = (0, _reactCosmosConfig.getCosmosConfig)(
                cosmosConfigPath
              );
              (rootPath = cosmosConfig.rootPath),
                (proxiesPath = cosmosConfig.proxiesPath),
                (fileMatch = cosmosConfig.fileMatch),
                (exclude = cosmosConfig.exclude),
                (componentPaths = cosmosConfig.componentPaths);

              if (!(componentPaths.length > 0)) {
                _context2.next = 5;
                break;
              }

              console.warn(
                '[Cosmos] Using `componentPaths` config is deprecated.' +
                  'Upgrading is required for snapshot testing.'
              );
              return _context2.abrupt('return');

            case 5:
              userProxies = (0, _server.moduleExists)(proxiesPath)
                ? (0, _reactCosmosShared.importModule)(require(proxiesPath))
                : [];
              proxies = [].concat(
                (0, _toConsumableArray3.default)(userProxies),
                [
                  // Loaded by default in all configs
                  (0, _reactCosmosStateProxy2.default)()
                ]
              );

              test(
                'Cosmos fixtures',
                (0, _asyncToGenerator3.default)(
                  /*#__PURE__*/ _regenerator2.default.mark(function _callee() {
                    var fixtureFiles,
                      fixtureModules,
                      components,
                      i,
                      component,
                      j,
                      fixture,
                      _createContext,
                      mount,
                      getWrapper,
                      tree;

                    return _regenerator2.default.wrap(
                      function _callee$(_context) {
                        while (1) {
                          switch ((_context.prev = _context.next)) {
                            case 0:
                              _context.next = 2;
                              return (0, _server2.findFixtureFiles)({
                                rootPath: rootPath,
                                fileMatch: fileMatch,
                                exclude: exclude
                              });

                            case 2:
                              fixtureFiles = _context.sent;
                              fixtureModules = getFixtureModules(fixtureFiles);
                              components = (0, _client.getComponents)({
                                fixtureModules: fixtureModules,
                                fixtureFiles: fixtureFiles
                              });
                              i = 0;

                            case 6:
                              if (!(i < components.length)) {
                                _context.next = 22;
                                break;
                              }

                              component = components[i];
                              j = 0;

                            case 9:
                              if (!(j < component.fixtures.length)) {
                                _context.next = 19;
                                break;
                              }

                              fixture = component.fixtures[j];
                              (_createContext = (0,
                              _reactCosmosLoader.createContext)({
                                renderer: _reactTestRenderer.create,
                                proxies: proxies,
                                fixture: fixture.source
                              })),
                                (mount = _createContext.mount),
                                (getWrapper = _createContext.getWrapper);
                              _context.next = 14;
                              return mount();

                            case 14:
                              tree = getWrapper().toJSON();

                              expect(tree).toMatchSnapshot(
                                component.name + ':' + fixture.name
                              );

                            case 16:
                              j++;
                              _context.next = 9;
                              break;

                            case 19:
                              i++;
                              _context.next = 6;
                              break;

                            case 22:
                            case 'end':
                              return _context.stop();
                          }
                        }
                      },
                      _callee,
                      undefined
                    );
                  })
                )
              );

            case 8:
            case 'end':
              return _context2.stop();
          }
        }
      },
      _callee2,
      undefined
    );
  })
);

function getFixtureModules(fixtureFiles) {
  return fixtureFiles.reduce(function(acc, f) {
    return (0,
    _extends4.default)({}, acc, (0, _defineProperty3.default)({}, f.filePath, (0, _reactCosmosShared.importModule)(require(f.filePath))));
  }, {});
}
