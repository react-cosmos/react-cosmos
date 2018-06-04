'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.connectLoader = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

/**
 * Connect fixture context to remote Playground UI via window.postMessage.
 * In the future we'll replace window.postMessage with a fully remote (likely
 * websockets) communication channel, which will allow the Playground and the
 * Loader to live in completely different environments (eg. Control a Native
 * component instance from a web Playground UI).
 *
 * It both receives fixture edits from parent frame and forwards fixture
 * updates bubbled up from proxy chain (due to state changes) to parent frame.
 */
var connectLoader = (exports.connectLoader = (function() {
  var _ref = (0, _asyncToGenerator3.default)(
    /*#__PURE__*/ _regenerator2.default.mark(function _callee3(args) {
      var loadFixture = (function() {
        var _ref2 = (0, _asyncToGenerator3.default)(
          /*#__PURE__*/ _regenerator2.default.mark(function _callee(fixture) {
            var notifyParent =
              arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : true;

            var _createContext, mount, _splitUnserializableP, serializable;

            return _regenerator2.default.wrap(
              function _callee$(_context) {
                while (1) {
                  switch ((_context.prev = _context.next)) {
                    case 0:
                      (_createContext = (0, _createContext2.createContext)({
                        renderer: renderer,
                        proxies: proxies,
                        fixture: fixture,
                        onUpdate: onContextUpdate
                      })),
                        (mount = _createContext.mount);
                      _context.next = 3;
                      return mount();

                    case 3:
                      if (notifyParent) {
                        // Notify back parent with the serializable contents of the loaded fixture
                        (_splitUnserializableP = (0,
                        _reactCosmosShared.splitUnserializableParts)(fixture)),
                          (serializable = _splitUnserializableP.serializable);

                        postMessageToParent({
                          type: 'fixtureLoad',
                          fixtureBody: serializable
                        });
                      }

                    case 4:
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

        return function loadFixture(_x3) {
          return _ref2.apply(this, arguments);
        };
      })();

      var onMessage = (function() {
        var _ref4 = (0, _asyncToGenerator3.default)(
          /*#__PURE__*/ _regenerator2.default.mark(function _callee2(_ref3) {
            var data = _ref3.data;

            var _component2,
              _fixture2,
              selectedFixture,
              _selected2,
              _component3,
              _fixture3;

            return _regenerator2.default.wrap(
              function _callee2$(_context2) {
                while (1) {
                  switch ((_context2.prev = _context2.next)) {
                    case 0:
                      if (!(data.type === 'fixtureSelect')) {
                        _context2.next = 14;
                        break;
                      }

                      (_component2 = data.component),
                        (_fixture2 = data.fixture);

                      if (
                        !(
                          fixtures[_component2] &&
                          fixtures[_component2][_fixture2]
                        )
                      ) {
                        _context2.next = 11;
                        break;
                      }

                      selected = { component: _component2, fixture: _fixture2 };

                      // No need for a cache at this point. Until a fixtureUpdate or
                      // fixtureEdit event is receved, fixture source changes will be
                      // applied immediately.
                      fixtureCache = undefined;

                      selectedFixture = fixtures[_component2][_fixture2];
                      _context2.next = 8;
                      return loadFixture(selectedFixture);

                    case 8:
                      if (dismissRuntimeErrors) {
                        dismissRuntimeErrors();
                      }
                      _context2.next = 12;
                      break;

                    case 11:
                      console.error(
                        '[Cosmos] Missing fixture for ' +
                          _component2 +
                          ':' +
                          _fixture2
                      );

                    case 12:
                      _context2.next = 23;
                      break;

                    case 14:
                      if (!(data.type === 'fixtureEdit')) {
                        _context2.next = 23;
                        break;
                      }

                      if (selected) {
                        _context2.next = 19;
                        break;
                      }

                      console.error('[Cosmos] No selected fixture to edit');
                      _context2.next = 23;
                      break;

                    case 19:
                      // This can be the first edit after a fixture was selected
                      if (!fixtureCache) {
                        (_selected2 = selected),
                          (_component3 = _selected2.component),
                          (_fixture3 = _selected2.fixture);

                        fixtureCache = fixtures[_component3][_fixture3];
                      }

                      // NOTE: Edits override the entire (serializable) fixture body
                      fixtureCache = applyFixtureBody(
                        fixtureCache,
                        data.fixtureBody
                      );

                      // Note: Creating fixture context from scratch on every fixture edit.
                      // This means that the component will always go down the
                      // componentDidMount path (instead of componentWillReceiveProps) when
                      // user edits fixture via fixture editor. In the future we might want
                      // to sometimes update the fixture context instead of resetting it.
                      _context2.next = 23;
                      return loadFixture(fixtureCache, false);

                    case 23:
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

        return function onMessage(_x4) {
          return _ref4.apply(this, arguments);
        };
      })();

      var proxies,
        fixtures,
        renderer,
        dismissRuntimeErrors,
        onContextUpdate,
        bind,
        unbind,
        isFirstCall,
        _selected3,
        _component4,
        _fixture4,
        originalFixture;

      return _regenerator2.default.wrap(
        function _callee3$(_context3) {
          while (1) {
            switch ((_context3.prev = _context3.next)) {
              case 0:
                unbind = function unbind() {
                  window.removeEventListener('message', onMessage);
                  unbindPrev = undefined;
                };

                bind = function bind() {
                  window.addEventListener('message', onMessage, false);
                };

                onContextUpdate = function onContextUpdate(fixturePart) {
                  if (!selected) {
                    return;
                  }

                  // This can be the first update after a fixture was selected
                  if (!fixtureCache) {
                    var _selected = selected,
                      _component = _selected.component,
                      _fixture = _selected.fixture;

                    fixtureCache = fixtures[_component][_fixture];
                  }

                  // NOTE: Updates extend the fixture fields
                  // Apply the entire updated fixture part...
                  fixtureCache = applyFixturePart(fixtureCache, fixturePart);

                  // ...but only the serializable part can be sent to parent

                  var _splitUnserializableP2 = (0,
                    _reactCosmosShared.splitUnserializableParts)(fixturePart),
                    serializable = _splitUnserializableP2.serializable;

                  postMessageToParent({
                    type: 'fixtureUpdate',
                    fixtureBody: serializable
                  });
                };

                (proxies = args.proxies),
                  (fixtures = args.fixtures),
                  (renderer = args.renderer),
                  (dismissRuntimeErrors = args.dismissRuntimeErrors);
                isFirstCall = !unbindPrev;

                // Implicitly unbind prev context when new one is created

                if (unbindPrev) {
                  unbindPrev();
                }
                unbindPrev = unbind;

                // Always bind onMessage handler to latest input
                bind();

                if (!isFirstCall) {
                  _context3.next = 12;
                  break;
                }

                // Let parent know loader is ready to render, along with the initial
                // fixture list (which might update later due to HMR)
                postMessageToParent({
                  type: 'loaderReady',
                  fixtures: extractFixtureNames(fixtures)
                });
                _context3.next = 28;
                break;

              case 12:
                // Keep parent up to date with fixture list
                postMessageToParent({
                  type: 'fixtureListUpdate',
                  fixtures: extractFixtureNames(fixtures)
                });

                if (!selected) {
                  _context3.next = 28;
                  break;
                }

                // Use the fixture cache contents if present, but always re-create the
                // context to ensure latest proxies and components are used.
                (_selected3 = selected),
                  (_component4 = _selected3.component),
                  (_fixture4 = _selected3.fixture);
                originalFixture = fixtures[_component4][_fixture4];

                if (originalFixture) {
                  _context3.next = 21;
                  break;
                }

                // Maybe fixture was renamed
                selected = undefined;
                fixtureCache = undefined;
                _context3.next = 28;
                break;

              case 21:
                if (!fixtureCache) {
                  _context3.next = 26;
                  break;
                }

                _context3.next = 24;
                return loadFixture(
                  (0, _extends3.default)({}, fixtureCache, {
                    component: originalFixture.component
                  })
                );

              case 24:
                _context3.next = 28;
                break;

              case 26:
                _context3.next = 28;
                return loadFixture(originalFixture);

              case 28:
                return _context3.abrupt('return', function destroy() {
                  if (unbindPrev) {
                    unbindPrev();
                    selected = undefined;
                    fixtureCache = undefined;
                  }
                });

              case 29:
              case 'end':
                return _context3.stop();
            }
          }
        },
        _callee3,
        this
      );
    })
  );

  return function connectLoader(_x) {
    return _ref.apply(this, arguments);
  };
})());

var _lodash = require('lodash.merge');

var _lodash2 = _interopRequireDefault(_lodash);

var _reactCosmosShared = require('react-cosmos-shared');

var _createContext2 = require('./create-context');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var unbindPrev = void 0;

// This will be populated on fixtureSelect events

var selected = void 0;

// The fixture cache can contain
// - Fixture updates received from proxy chain via context's onUpdate handler
// - Fixture edits received from Playground UI
// The cache is cleared when a fixture (including the current one) is selected
var fixtureCache = void 0;

function postMessageToParent(data) {
  parent.postMessage(data, '*');
}

function extractFixtureNames(fixtures) {
  return Object.keys(fixtures).reduce(function(acc, next) {
    acc[next] = Object.keys(fixtures[next]);
    return acc;
  }, {});
}

function applyFixturePart(currentFixture, fixturePart) {
  return (0, _extends3.default)({}, currentFixture, fixturePart);
}

function applyFixtureBody(currentFixture, fixtureBody) {
  var _splitUnserializableP3 = (0, _reactCosmosShared.splitUnserializableParts)(
      currentFixture
    ),
    unserializable = _splitUnserializableP3.unserializable;

  return (0, _lodash2.default)({}, unserializable, fixtureBody);
}
