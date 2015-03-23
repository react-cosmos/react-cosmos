var _ = require('lodash'),
    serialize = require('./serialize.js');

var Router = function(options) {
  this._options = _.extend({
    defaultProps: {},
    container: document.body
  }, options);

  this.onPopState = this.onPopState.bind(this);
  this._bindPopStateEvent();

  // The initial render is done instantly when the Router instance is created
  this._load(this._getPropsFromLocation(this._getCurrentLocation()));
};

Router.prototype = {
  stop: function() {
    this._unbindPopStateEvent();
  },

  goTo: function(location) {
    // Old-school refreshes are made when pushState isn't supported
    if (!this._isPushStateSupported()) {
      window.location = location;
      return;
    }

    // The history entry for the previous component is updated with its
    // lastest state, so that we resume it in its exact form when going back
    // and forth through the browser history
    // TODO: Only update history state when component is changing. props.state
    // is only used by ComponentTree when mounting anyway
    if (this.rootComponent && _.isFunction(this.rootComponent.serialize)) {
      var snapshot = this.rootComponent.serialize(true);

      // The component might be stateless...
      if (!_.isEmpty(snapshot.state)) {
        this._replaceHistoryState(this._getSerializableState(snapshot.state),
                                  this._getCurrentLocation());
      }
    }

    // Create a history entry for the new component, with an empty state for
    // now (see previous lines)
    this._pushHistoryState({}, location);

    this._load(this._getPropsFromLocation(location));
  },

  onPopState: function(e) {
    // Chrome & Safari trigger an empty popState event initially, while
    // Firefox doesn't, we choose to ignore that event altogether
    if (!e.state) {
      return;
    }
    var location = this._getCurrentLocation(),
        props = this._getPropsFromLocation(location);

    if (!_.isEmpty(e.state)) {
      props.state = e.state;
    }

    this._load(props, location);
  },

  _load: function(newProps) {
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

    if (_.isFunction(this._options.onChange)) {
      this._options.onChange.call(this, newProps);
    }
  },

  _getPropsFromLocation: function(location) {
    var queryString = location.split('?').pop();

    return serialize.getPropsFromQueryString(queryString);
  },

  _getCurrentLocation: function() {
    return window.location.href;
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

  _isPushStateSupported: function() {
    return !!window.history.pushState;
  },

  _getSerializableState: function(state) {
    return JSON.parse(JSON.stringify(state));
  }
};

exports.Router = Router;
