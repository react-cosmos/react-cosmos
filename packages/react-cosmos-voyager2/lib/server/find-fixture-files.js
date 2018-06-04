'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.findFixtureFiles = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

/**
 * Search the user code for fixture files.
 */
var findFixtureFiles = (exports.findFixtureFiles = (function() {
  var _ref = (0, _asyncToGenerator3.default)(
    /*#__PURE__*/ _regenerator2.default.mark(function _callee(args) {
      var _this = this;

      var _ref2,
        _ref2$rootPath,
        rootPath,
        _ref2$fileMatch,
        fileMatch,
        _ref2$exclude,
        exclude,
        excludeList,
        allPaths,
        fixturePaths,
        fixtureFiles,
        _loop,
        i,
        _ret;

      return _regenerator2.default.wrap(
        function _callee$(_context2) {
          while (1) {
            switch ((_context2.prev = _context2.next)) {
              case 0:
                (_ref2 = args || {}),
                  (_ref2$rootPath = _ref2.rootPath),
                  (rootPath =
                    _ref2$rootPath === undefined
                      ? process.cwd()
                      : _ref2$rootPath),
                  (_ref2$fileMatch = _ref2.fileMatch),
                  (fileMatch =
                    _ref2$fileMatch === undefined
                      ? _server.defaultFileMatch
                      : _ref2$fileMatch),
                  (_ref2$exclude = _ref2.exclude),
                  (exclude =
                    _ref2$exclude === undefined
                      ? _server.defaultExclude
                      : _ref2$exclude);
                excludeList = Array.isArray(exclude) ? exclude : [exclude];
                _context2.next = 4;
                return globAsync('**/*', {
                  cwd: rootPath,
                  absolute: true,
                  ignore: '**/node_modules/**'
                });

              case 4:
                allPaths = _context2.sent;
                fixturePaths = (0, _micromatch2.default)(allPaths, fileMatch);
                fixtureFiles = [];

                // Can't use forEach because we want each (async) loop to be serial

                _loop = /*#__PURE__*/ _regenerator2.default.mark(function _loop(
                  i
                ) {
                  var filePath, components;
                  return _regenerator2.default.wrap(
                    function _loop$(_context) {
                      while (1) {
                        switch ((_context.prev = _context.next)) {
                          case 0:
                            filePath = fixturePaths[i];

                            if (
                              !excludeList.some(function(excludePattern) {
                                return filePath.match(excludePattern);
                              })
                            ) {
                              _context.next = 3;
                              break;
                            }

                            return _context.abrupt('return', 'continue');

                          case 3:
                            _context.next = 5;
                            return (0,
                            _extractComponentsFromFixtureFile.extractComponentsFromFixtureFile)(
                              filePath,
                              rootPath
                            );

                          case 5:
                            components = _context.sent;

                            fixtureFiles.push({
                              filePath: filePath,
                              components: components
                            });

                          case 7:
                          case 'end':
                            return _context.stop();
                        }
                      }
                    },
                    _loop,
                    _this
                  );
                });
                i = 0;

              case 9:
                if (!(i < fixturePaths.length)) {
                  _context2.next = 17;
                  break;
                }

                return _context2.delegateYield(_loop(i), 't0', 11);

              case 11:
                _ret = _context2.t0;

                if (!(_ret === 'continue')) {
                  _context2.next = 14;
                  break;
                }

                return _context2.abrupt('continue', 14);

              case 14:
                i++;
                _context2.next = 9;
                break;

              case 17:
                return _context2.abrupt('return', fixtureFiles);

              case 18:
              case 'end':
                return _context2.stop();
            }
          }
        },
        _callee,
        this
      );
    })
  );

  return function findFixtureFiles(_x) {
    return _ref.apply(this, arguments);
  };
})());

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _micromatch = require('micromatch');

var _micromatch2 = _interopRequireDefault(_micromatch);

var _util = require('util.promisify');

var _util2 = _interopRequireDefault(_util);

var _server = require('react-cosmos-shared/lib/server');

var _extractComponentsFromFixtureFile = require('./extract-components-from-fixture-file');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var globAsync = (0, _util2.default)(_glob2.default);
