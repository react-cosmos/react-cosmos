Fresh.serialize = {
  getPropsFromQueryString: function(queryString) {
    var props = {};
    if (queryString.length) {
      var pairs = queryString.split('&'),
          parts,
          key,
          value;
      for (var i = 0; i < pairs.length; i++) {
        parts = pairs[i].split('=');
        key = parts[0];
        value = parts[1];
        if (key == 'state') {
          value = JSON.parse(decodeURIComponent(value));
        }
        props[key] = value;
      }
    }
    return props;
  },
  getQueryStringFromProps: function(props) {
    var parts = [],
        value;
    for (var key in props) {
      value = props[key];
      // Objects can be embedded in a query string as well
      if (typeof value == 'object') {
        value = encodeURIComponent(JSON.stringify(value));
      }
      parts.push(key + '=' + value);
    }
    return parts.join('&');
  }
};
