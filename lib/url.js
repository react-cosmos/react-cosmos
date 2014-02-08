fresh.url = {
  getParams: function () {
    var str = window.location.search.substr(1),
        params = {};
    if (str) {
      var pairs = str.split('&'),
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
        params[key] = value;
      }
    }
    return params;
  }
};
