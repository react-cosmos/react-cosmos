var _ = require('lodash'),
    serialize = require('../serialize.js'),
    url = require('./url.js');

var Router = function(options) {
  this._options = _.extend({
    defaultProps: {},
    container: document.body
  }, options);

  this.onPopState = this.onPopState.bind(this);
  this._bindPopStateEvent();

  // The initial render is done instantly when the Router instance is created
  this._load(url.getParams(), window.location.href);
};

Router.prototype = {
  stop: function() {
    this._unbindPopStateEvent();
  },

  goTo: function(href) {
    // Old-school refreshes are made when pushState isn't supported
    if (!url.isPushStateSupported()) {
      window.location = href;
      return;
    }

    // The history entry for the previous component is updated with its
    // lastest props and state, so that we resume it its exact form when/if
    // going back
    if (this.rootComponent) {
      var snapshot = this.rootComponent.serialize(true);
      this._replaceHistoryState(this._excludeDefaultProps(snapshot),
                                this._currentHref);
    }

    var queryString = href.split('?').pop(),
        props = serialize.getPropsFromQueryString(queryString);

    // Calling pushState programatically doesn't trigger the onpopstate
    // event, only a browser page change does. Otherwise this would've
    // triggered an infinite loop.
    // https://developer.mozilla.org/en-US/docs/Web/API/window.onpopstate
    this._pushHistoryState(props, href);

    this._load(props, href);
  },

  onPopState: function(e) {
    // Chrome & Safari trigger an empty popState event initially, while
    // Firefox doesn't, we choose to ignore that event altogether
    if (!e.state) {
      return;
    }
    this._load(e.state, window.location.href);
  },

  _load: function(newProps, href) {
    var baseProps = {
      // Always send the components a reference to the router. This makes it
      // possible for a component to change the page through the router and
      // not have to rely on any sort of globals
      router: this
    };
    var props = _.extend(baseProps, this._options.defaultProps, newProps);

    // The router exposes the instance of the currently rendered component
    this.rootComponent = this._options.onRender(props,
                                                this._options.container);

    // We use the current href when updating the current history entry
    this._currentHref = href;

    if (_.isFunction(this._options.onChange)) {
      this._options.onChange.call(this, newProps);
    }
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
      // Ignore the Router reference because it gets attached automatically
      // when sending new props to a component
      if (key === 'router') {
        continue;
      }

      value = props[key];

      if (value !== this._options.defaultProps[key]) {
        newProps[key] = value;
      }
    }

    return newProps;
  }
};

module.exports = Router;
