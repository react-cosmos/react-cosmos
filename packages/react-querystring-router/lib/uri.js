'use strict';

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

module.exports = {
  parseLocation: function parseLocation(location) {
    var params = {};

    if (location.indexOf('?') === -1) {
      return params;
    }

    var queryString = location.split('?').pop();
    if (queryString.length === 0) {
      return params;
    }

    var pairs = queryString.split('&');
    var parts = void 0;
    var key = void 0;
    var value = void 0;

    pairs.forEach(function(pair) {
      parts = pair.split('=');
      key = parts[0];
      value = decodeURIComponent(parts[1]);

      try {
        value = JSON.parse(value);
      } catch (err) {
        // If the prop was a simple type and not a stringified JSON it will
        // keep its original value
      }

      params[key] = value;
    });

    return params;
  },

  stringifyParams: function stringifyParams(params) {
    /**
     * Serializes JSON params into a browser-complient URL. The URL
     * generated can be simply put inside the href attribute of an <a> tag
     */
    var parts = [];
    var value = void 0;

    Object.keys(params).forEach(function(key) {
      value = params[key];

      // Objects can be embedded in a query string as well
      if (
        (typeof value === 'undefined'
          ? 'undefined'
          : (0, _typeof3.default)(value)) === 'object'
      ) {
        try {
          value = JSON.stringify(value);
        } catch (err) {
          // Params that can't be stringified should be ignored
          return;
        }
      }

      parts.push(key + '=' + encodeURIComponent(value));
    });

    return '?' + parts.join('&');
  }
};
