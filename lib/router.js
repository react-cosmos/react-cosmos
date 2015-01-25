Cosmos.Router = function(defaultProps, container) {
  this._defaultProps = defaultProps || {};
  this._container = container || document.body;

  this.onPopState = this.onPopState.bind(this);
  this._bindPopStateEvent();

  // The initial render is done instantly when the Router instance is created
  this._load(Cosmos.url.getParams(), window.location.href);
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

      // The history entry for the previous component is updated with its
      // lastest props and state, so that we resume it its exact form when/if
      // going back
      if (this.rootComponent) {
        var snapshot = this.rootComponent.generateSnapshot();
        this._replaceHistoryState(this._excludeDefaultProps(snapshot),
                                  this._currentHref);
      }

      var queryString = href.split('?').pop(),
          props = Cosmos.serialize.getPropsFromQueryString(queryString);

      // The callback has the component as the context
      var _this = this;
      this._load(props, href, function() {
        // Calling pushState programatically doesn't trigger the onpopstate
        // event, only a browser page change does. Otherwise this would've
        // triggered an infinite loop.
        // https://developer.mozilla.org/en-US/docs/Web/API/window.onpopstate
        var snapshot = this.generateSnapshot();
        _this._pushHistoryState(_this._excludeDefaultProps(snapshot), href);
      });
    },

    onPopState: function(e) {
      // Chrome & Safari trigger an empty popState event initially, while
      // Firefox doesn't, we choose to ignore that event altogether
      if (!e.state) {
        return;
      }
      this._load(e.state, window.location.href);
    },

    _load: function(newProps, href, callback) {
      var props = _.extend({}, this._defaultProps, newProps, {
        // Always send the components a reference to the router. This makes it
        // possible for a component to change the page through the router and
        // not have to rely on any sort of globals
        router: this
      });
      this.rootComponent = Cosmos.render(props, this._container, callback);
      this._currentHref = href;
    },

    _bindPopStateEvent: function() {
      window.addEventListener('popstate', this.onPopState);
    },

    _unbindPopStateEvent: function() {
      window.removeEventListener('popstate', this.onPopState);
    },

    _replaceHistoryState: function(state, url) {
      window.history.replaceState(state, '', url);
    },

    _pushHistoryState: function(state, url) {
      window.history.pushState(state, '', url);
    },

    _excludeDefaultProps: function(props) {
      var newProps = {},
          value;

      for (var key in props) {
        value = props[key];

        if (value !== this._defaultProps[key]) {
          newProps[key] = value;
        }
      }

      return newProps;
    }
  }
});
