'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.createContext = createContext;

var _asyncUntil = require('async-until');

var _asyncUntil2 = _interopRequireDefault(_asyncUntil);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Loader = require('./components/Loader');

var _Loader2 = _interopRequireDefault(_Loader);

var _isComponentClass = require('./utils/is-component-class');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var wrapper = void 0;

/**
 * Generalized way to render fixtures, without any assumptions on the renderer.
 *
 * The fixture context records state changes received from the rendered proxy
 * chain and provides helper methods for reading the latest state (via get) or
 * subscribing to all updates (via onUpdate). The former is used in headless
 * test environments while the latter in the Playground UI's "fixture editor".
 *
 * Important: Because some proxies are global by nature (eg. fetch-proxy mocks
 * window.fetch) there can only be one active context per page. This means that
 * mounting a new context will unmount the previous automatically.
 */
function createContext(args) {
  var renderer = args.renderer,
    rendererOptions = args.rendererOptions,
    _args$proxies = args.proxies,
    proxies = _args$proxies === undefined ? [] : _args$proxies,
    fixture = args.fixture,
    onUpdate = args.onUpdate,
    beforeInit = args.beforeInit;

  var updatedFixture = (0, _extends3.default)({}, fixture);
  var compRefCalled = false;
  var compRef = void 0;

  function getRef() {
    if (!compRef) {
      throw new Error(
        'Component ref is not available yet. Did you mount() the context?'
      );
    }

    return compRef;
  }

  function getWrapper() {
    if (!wrapper) {
      throw new Error(
        "Context wrapper hasn't been created yet. Did you mount() the context?"
      );
    }

    return wrapper;
  }

  function get(fixtureKey) {
    return fixtureKey ? updatedFixture[fixtureKey] : updatedFixture;
  }

  function update(fixturePart) {
    updatedFixture = (0, _extends3.default)({}, updatedFixture, fixturePart);

    if (onUpdate) {
      onUpdate(fixturePart);
    }
  }

  function mount() {
    var _this = this;

    var clearPrevInstance =
      arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

    return new Promise(
      (function() {
        var _ref = (0, _asyncToGenerator3.default)(
          /*#__PURE__*/ _regenerator2.default.mark(function _callee(
            resolve,
            reject
          ) {
            return _regenerator2.default.wrap(
              function _callee$(_context) {
                while (1) {
                  switch ((_context.prev = _context.next)) {
                    case 0:
                      _context.prev = 0;

                      if (clearPrevInstance) {
                        unmount();

                        // Bring fixture to its initial state
                        updatedFixture = (0, _extends3.default)({}, fixture);
                      }

                      wrapper = renderer(
                        _react2.default.createElement(_Loader2.default, {
                          proxies: proxies,
                          fixture: updatedFixture,
                          onComponentRef: function onComponentRef(ref) {
                            // Sometimes the component unmounts instantly (eg. redirects on
                            // componentWillMount and parent HoC doesn't render it anymore).
                            // In this cases compRef will be null but we'll know that the
                            // component rendered
                            compRefCalled = true;
                            compRef = ref;
                          },
                          onFixtureUpdate: update
                        }),
                        rendererOptions
                      );

                      // Ensure component ref is available when mounting is resolved (esp.
                      // convenient in headless tests)

                      if (
                        !(0, _isComponentClass.isComponentClass)(
                          fixture.component
                        )
                      ) {
                        _context.next = 6;
                        break;
                      }

                      _context.next = 6;
                      return (0, _asyncUntil2.default)(function() {
                        return compRefCalled;
                      });

                    case 6:
                      if (!beforeInit) {
                        _context.next = 9;
                        break;
                      }

                      _context.next = 9;
                      return beforeInit();

                    case 9:
                      if (!fixture.init) {
                        _context.next = 12;
                        break;
                      }

                      _context.next = 12;
                      return fixture.init({ compRef: compRef });

                    case 12:
                      resolve();
                      _context.next = 18;
                      break;

                    case 15:
                      _context.prev = 15;
                      _context.t0 = _context['catch'](0);

                      reject(_context.t0);

                    case 18:
                    case 'end':
                      return _context.stop();
                  }
                }
              },
              _callee,
              _this,
              [[0, 15]]
            );
          })
        );

        return function(_x2, _x3) {
          return _ref.apply(this, arguments);
        };
      })()
    );
  }

  function unmount() {
    if (wrapper) {
      wrapper.unmount();
      wrapper = undefined;
    }
  }

  return {
    mount: mount,
    unmount: unmount,
    getRef: getRef,
    getWrapper: getWrapper,
    get: get,
    getField: get
  };
}
