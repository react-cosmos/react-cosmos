Cosmos.Router = function(options) {
  // The Router defaults are dynamic values they must be read whenever an
  // instance is created, thus they are not embedded in the Class prototype
  this.options = _.extend({
    props: Cosmos.url.getParams(),
    container: document.body
  }, options);
  // defaultsProps is not applied when props are missing, but when they are
  // empty (regardless if they come from options or the default Rotuer props)
  if (_.isEmpty(this.options.props) && this.options.defaultProps) {
    this.options.props = this.options.defaultProps;
  }
  this.container = this.options.container;
  this._onPopState = this._onPopState.bind(this);
  this._bindPopStateEvent();
  // The initial render is done when the Router is instantiated
  this._load(this.options.props, window.location.href);
};
_.extend(Cosmos.Router, {
  prototype: {
    stop: function() {
      this._unbindPopStateEvent();
    },
    goTo: function(href) {
      // Old-school refreshes are made when pushState isn't supported
      if (!Cosmos.url.isPushStateSupported()) {
        window.location = href;
        return;
      }
      // The history entry for the previous Component is updated with its
      // lastest props and state, so that we resume it its exact form when/if
      // going back
      if (this._currentComponent) {
        this._replaceHistoryState(
          this._currentComponent.generateSnapshot(),
          this._currentHref);
      }
      var queryString = href.split('?').pop(),
          props = Cosmos.serialize.getPropsFromQueryString(queryString);
      // Calling pushState doesn't trigger the onpopstate event, so push state
      // events and programatic Router calls are individually handled
      // https://developer.mozilla.org/en-US/docs/Web/API/window.onpopstate
      this._load(props, href);
      this._pushHistoryState(props, href);
    },
    _load: function(props, href) {
      this._currentComponent = Cosmos.render(props, this.container);
      this._currentHref = href;
    },
    _bindPopStateEvent: function() {
      window.addEventListener('popstate', this._onPopState);
    },
    _unbindPopStateEvent: function() {
      window.removeEventListener('popstate', this._onPopState);
    },
    _onPopState: function(e) {
      // Chrome & Safari trigger an empty popState event initially, while
      // Firefox doesn't, we choose to ignore that event altogether
      if (!e.state) {
        return;
      }
      this._load(e.state, window.location.href);
    },
    _replaceHistoryState: function(props, url) {
      window.history.replaceState(props, '', url);
    },
    _pushHistoryState: function(state, url) {
      window.history.pushState(state, '', url);
    }
  }
});
