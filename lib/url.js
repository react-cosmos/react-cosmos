var url = {
  getParams: function () {
    var str = window.location.search.substr(1),
        params = {};
    if (str) {
      var pairs = str.split('&'),
          parts;
      for (var i = 0; i < pairs.length; i++) {
        parts = pairs[i].split('=');
        params[parts[0]] = parts[1];
      }
    }
    return params;
  }
};
