'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _reactCosmosConfig = require('react-cosmos-config');

var _server = require('react-cosmos-voyager2/lib/server');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

exports.default = (function() {
  var _ref = (0, _asyncToGenerator3.default)(
    /*#__PURE__*/ _regenerator2.default.mark(function _callee() {
      var cosmosConfig, fixtureFiles;
      return _regenerator2.default.wrap(
        function _callee$(_context) {
          while (1) {
            switch ((_context.prev = _context.next)) {
              case 0:
                cosmosConfig = (0, _reactCosmosConfig.getCosmosConfig)();
                _context.next = 3;
                return (0, _server.findFixtureFiles)(cosmosConfig);

              case 3:
                fixtureFiles = _context.sent;

                console.log(JSON.stringify(fixtureFiles, null, 2));

              case 5:
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

  function printFixtureFiles() {
    return _ref.apply(this, arguments);
  }

  return printFixtureFiles;
})();
