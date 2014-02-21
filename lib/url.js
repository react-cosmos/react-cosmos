Fresh.url = {
  getParams: function() {
    return Fresh.serialize.getPropsFromQueryString(
      window.location.search.substr(1));
  },
  isPushStateSupported: function() {
    return !!window.history.pushState;
  }
};
