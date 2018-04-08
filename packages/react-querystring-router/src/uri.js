export function parseLocation(location) {
  const params = {};

  if (location.indexOf('?') === -1) {
    return params;
  }

  const queryString = location.split('?').pop();
  if (queryString.length === 0) {
    return params;
  }

  const pairs = queryString.split('&');
  let parts;
  let key;
  let value;

  pairs.forEach(pair => {
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
}

export function stringifyParams(params) {
  /**
   * Serializes JSON params into a browser-complient URL. The URL
   * generated can be simply put inside the href attribute of an <a> tag
   */
  const parts = [];
  let value;

  Object.keys(params).forEach(key => {
    value = params[key];

    // Objects can be embedded in a query string as well
    if (typeof value === 'object') {
      try {
        value = JSON.stringify(value);
      } catch (err) {
        // Params that can't be stringified should be ignored
        return;
      }
    }

    parts.push(`${key}=${encodeURIComponent(value)}`);
  });

  return `?${parts.join('&')}`;
}
