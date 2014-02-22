Fresh.Router = function(options) {
  this.container = options.container;
  // The Router listens to popstate events until .stop is called
  this._onPopState = this._onPopState.bind(this);
  this._bindPopStateEvent();
  this._replaceInitialState(options.props);
};
Fresh.Router.prototype = {
  stop: function() {
    this._unbindPopStateEvent();
  },
  goTo: function(href) {
    if (!Fresh.url.isPushStateSupported()) {
      window.location = href;
      return;
    }
    var queryString = href.split('?').pop(),
        props = Fresh.serialize.getPropsFromQueryString(queryString);
    this._pushState(props, href);
    // We load the new props manually because calling pushState doesn't trigger
    // an onpopstate event, it only pushes it in the browser state history.
    // https://developer.mozilla.org/en-US/docs/Web/API/window.onpopstate
    Fresh.render(props, this.container);
  },
  _bindPopStateEvent: function() {
    window.addEventListener('popstate', this._onPopState);
  },
  _unbindPopStateEvent: function() {
    window.removeEventListener('popstate', this._onPopState);
  },
  _onPopState: function(e) {
    // Chrome & Safari trigger an empty popState event initially, while Firefox
    // doesn't, we choose to ignore that event altogether
    if (e.state) {
      Fresh.render(e.state, this.container);
    }
  },
  _replaceInitialState: function(props) {
    // The initial state must contain the props of the first loaded component
    // for when the users go Back in the browser
    window.history.replaceState(props, '', window.location.href);
  },
  _pushState: function(props, href) {
    window.history.pushState(props, '', href);
  }
};
