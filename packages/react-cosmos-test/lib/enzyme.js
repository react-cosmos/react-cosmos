'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.createContext = createContext;

var _enzyme = require('enzyme');

var _generic = require('./generic');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

// eslint-disable-next-line no-undef
function createContext(args) {
  var context = (0, _generic.createContext)(
    (0, _extends3.default)({}, args, {
      renderer: _enzyme.mount
    })
  );
  var mount = context.mount,
    unmount = context.unmount,
    getRef = context.getRef,
    get = context.get,
    getField = context.getField;

  function getRootWrapper() {
    var wrapper = wrapWrapper(context.getWrapper());

    // Ensure the returned wrapper is always up to date
    wrapper.update();

    return wrapper;
  }

  function getWrapper(selector) {
    var fixture = args.fixture;

    var innerWrapper = getRootWrapper().find(fixture.component);

    return selector ? innerWrapper.find(selector) : innerWrapper;
  }

  return {
    mount: mount,
    unmount: unmount,
    getRef: getRef,
    get: get,
    getField: getField,
    getRootWrapper: getRootWrapper,
    getWrapper: getWrapper
  };
}

// Sorry Flow: I don't know how to show you that the wrapper is already an
// EnzymeWrapper
function wrapWrapper(wrapper) {
  if (typeof wrapper.update !== 'function') {
    throw new TypeError('update method missing on Enzyme wrapper');
  }
  if (typeof wrapper.find !== 'function') {
    throw new TypeError('find method missing on Enzyme wrapper');
  }

  return wrapper;
}
