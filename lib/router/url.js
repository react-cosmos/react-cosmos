var serialize = require('../serialize.js');

module.exports = {
  getParams: function() {
    return serialize.getPropsFromQueryString(this.getQueryString().substr(1));
  },

  isPushStateSupported: function() {
    return !!window.history.pushState;
  },

  getQueryString: function() {
    return window.location.search;
  }
};
