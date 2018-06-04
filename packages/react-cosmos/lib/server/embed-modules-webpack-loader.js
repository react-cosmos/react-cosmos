'use strict';

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var getNormalizedModules = (function() {
  var _ref3 = (0, _asyncToGenerator3.default)(
    /*#__PURE__*/ _regenerator2.default.mark(function _callee2(cosmosConfig) {
      var componentPaths,
        _getFilePaths,
        components,
        fixtures,
        _fixtureFiles,
        fixtureFiles;

      return _regenerator2.default.wrap(
        function _callee2$(_context2) {
          while (1) {
            switch ((_context2.prev = _context2.next)) {
              case 0:
                componentPaths = cosmosConfig.componentPaths;

                if (!(componentPaths.length > 0)) {
                  _context2.next = 7;
                  break;
                }

                console.warn(
                  '[Cosmos] Using `componentPaths` config is deprecated. ' +
                    'Please consider upgrading.'
                );

                (_getFilePaths = (0, _reactCosmosVoyager2.default)(
                  cosmosConfig
                )),
                  (components = _getFilePaths.components),
                  (fixtures = _getFilePaths.fixtures);
                _fixtureFiles = [];

                // Convert old format to new format

                keys(fixtures).forEach(function(componentName) {
                  keys(fixtures[componentName]).forEach(function(fixtureName) {
                    _fixtureFiles.push({
                      filePath: fixtures[componentName][fixtureName],
                      components: [
                        {
                          name: componentName,
                          filePath: components[componentName]
                        }
                      ]
                    });
                  });
                });

                return _context2.abrupt('return', {
                  fixtureFiles: _fixtureFiles,
                  deprecatedComponentModules: components
                });

              case 7:
                _context2.next = 9;
                return (0, _server2.findFixtureFiles)(cosmosConfig);

              case 9:
                fixtureFiles = _context2.sent;
                return _context2.abrupt('return', {
                  fixtureFiles: fixtureFiles,
                  deprecatedComponentModules: {}
                });

              case 11:
              case 'end':
                return _context2.stop();
            }
          }
        },
        _callee2,
        this
      );
    })
  );

  return function getNormalizedModules(_x2) {
    return _ref3.apply(this, arguments);
  };
})();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _reactCosmosConfig = require('react-cosmos-config');

var _server = require('react-cosmos-shared/lib/server');

var _reactCosmosVoyager = require('react-cosmos-voyager');

var _reactCosmosVoyager2 = _interopRequireDefault(_reactCosmosVoyager);

var _server2 = require('react-cosmos-voyager2/lib/server');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var keys = Object.keys;

/**
 * Inject require calls in bundle for each component/fixture path and
 * require.context calls for each dir with user modules. Tells webpack to
 * - Bundle all necessary component/fixture modules
 * - Watch for (and react to) added and changed component/fixture files
 */

module.exports = (function() {
  var _ref = (0, _asyncToGenerator3.default)(
    /*#__PURE__*/ _regenerator2.default.mark(function _callee(source) {
      var _this = this;

      var callback,
        cosmosConfig,
        proxiesPath,
        _ref2,
        fixtureFiles,
        deprecatedComponentModules,
        fixturePaths,
        fixtureModuleCalls,
        componentModuleCallls,
        contexts,
        result;

      return _regenerator2.default.wrap(
        function _callee$(_context) {
          while (1) {
            switch ((_context.prev = _context.next)) {
              case 0:
                callback = this.async();
                cosmosConfig = (0, _reactCosmosConfig.getCosmosConfig)();
                proxiesPath = cosmosConfig.proxiesPath;
                _context.next = 5;
                return getNormalizedModules(cosmosConfig);

              case 5:
                _ref2 = _context.sent;
                fixtureFiles = _ref2.fixtureFiles;
                deprecatedComponentModules = _ref2.deprecatedComponentModules;
                fixturePaths = getFixturePaths(fixtureFiles);
                fixtureModuleCalls = convertPathsToRequireCalls(fixturePaths);
                componentModuleCallls = convertPathsToRequireCalls(
                  keys(deprecatedComponentModules).map(function(c) {
                    return deprecatedComponentModules[c];
                  })
                );
                contexts = getUniqueDirsOfPaths(fixturePaths);

                contexts.forEach(function(dirPath) {
                  // This ensures this loader is invalidated whenever a new component/fixture
                  // file is created or renamed, which leads succesfully uda ...
                  _this.addDependency(dirPath);
                });

                result = source
                  .replace(/FIXTURE_MODULES/g, fixtureModuleCalls)
                  .replace(/FIXTURE_FILES/g, JSON.stringify(fixtureFiles))
                  .replace(
                    /DEPRECATED_COMPONENT_MODULES/g,
                    componentModuleCallls
                  )
                  .replace(
                    /PROXIES/g,
                    (0, _server.moduleExists)(proxiesPath)
                      ? convertPathToRequireCall(proxiesPath)
                      : '[]'
                  )
                  .replace(
                    /CONTEXTS/g,
                    convertDirPathsToContextCalls(contexts)
                  );

                callback(null, result);

              case 15:
              case 'end':
                return _context.stop();
            }
          }
        },
        _callee,
        this
      );
    })
  );

  function embedModules(_x) {
    return _ref.apply(this, arguments);
  }

  return embedModules;
})();

function getFixturePaths(files) {
  return files.map(function(file) {
    return file.filePath;
  });
}

function convertPathsToRequireCalls(paths) {
  var entries = paths.map(function(p) {
    return "'" + p + "':" + convertPathToRequireCall(p);
  });

  return '{' + entries.join(',') + '}';
}

function convertPathToRequireCall(p) {
  return "require('" + p + "')";
}

function getUniqueDirsOfPaths(paths) {
  var dirs = new Set();
  paths.forEach(function(p) {
    return dirs.add(_path2.default.dirname(p));
  });

  return [].concat((0, _toConsumableArray3.default)(dirs));
}

function convertDirPathsToContextCalls(dirPaths) {
  return (
    '[' +
    dirPaths
      .map(function(dirPath) {
        return "require.context('" + dirPath + "',false,/\\.jsx?$/)";
      })
      .join(',') +
    ']'
  );
}
