Cosmos.url = {
  getParams: function() {
    return Cosmos.serialize.getPropsFromQueryString(
      window.location.search.substr(1));
  },
  isPushStateSupported: function() {
    return !!window.history.pushState;
  }
};
