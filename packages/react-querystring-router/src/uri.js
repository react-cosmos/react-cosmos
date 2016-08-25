module.exports = {
  parseLocation: function(location) {
    var params = {};

    if (location.indexOf('?') === -1) {
      return params;
    }

    var queryString = location.split('?').pop();

    if (!queryString.length) {
      return params;
    }

    var pairs = queryString.split('&'),
        parts,
        key,
        value;

    for (var i = 0; i < pairs.length; i++) {
      parts = pairs[i].split('=');
      key = parts[0];
      value = decodeURIComponent(parts[1]);

      try {
        value = JSON.parse(value);
      } catch (e) {
        // If the prop was a simple type and not a stringified JSON it will
        // keep its original value
      }

      params[key] = value;
    }

    return params;
  },

  stringifyParams: function(params) {
    /**
     * Serializes JSON params into a browser-complient URL. The URL
     * generated can be simply put inside the href attribute of an <a> tag
     */
    var parts = [],
        value;

    for (var key in params) {
      value = params[key];

      // Objects can be embedded in a query string as well
      if (typeof value == 'object') {
        try {
          value = JSON.stringify(value);
        } catch (e) {
          // Params that can't be stringified should be ignored
          continue;
        }
      }

      parts.push(key + '=' + encodeURIComponent(value));
    }

    return '?' + parts.join('&');
  }
};
