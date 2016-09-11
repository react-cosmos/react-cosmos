/* eslint-env browser */

import React from 'react';
import _ from 'lodash';
import uri from './uri.js';

const ReactDOM = require('react-dom-polyfill')(React);

class Router {
  constructor(options) {
    this.options = _.extend({
      defaultProps: {},
    }, options);

    this.routeLink = this.routeLink.bind(this);
    this.onPopState = this.onPopState.bind(this);

    this.bindPopStateEvent();

    // The initial render is done instantly when the Router instance is created
    this.loadParams(uri.parseLocation(this.getCurrentLocation()));
  }

  stop() {
    this.unbindPopStateEvent();
  }

  routeLink(event) {
    /**
     * Any <a> tag can have this method bound to its onClick event to have
     * their corresponding href location picked up by the built-in Router
     * implementation, which uses pushState to switch between Components
     * instead of reloading pages.
     */
    event.preventDefault();

    this.pushLocation(event.currentTarget.href);
  }

  goTo(location) {
    this.pushLocation(location);
  }

  onPopState() {
    const location = this.getCurrentLocation();
    const params = uri.parseLocation(location);

    this.loadParams(params);
  }

  pushLocation(location) {
    // Old-school refreshes are made when pushState isn't supported
    if (!this.isPushStateSupported()) {
      window.location = location;
      return;
    }

    // Create a history entry for the new component
    this.pushHistoryState({}, location);

    this.loadParams(uri.parseLocation(location));
  }

  loadParams(params) {
    const props = _.extend({
      // Always send the components a reference to the router. This makes it
      // possible for a component to change the page through the router and
      // not have to rely on any sort of globals
      router: this,
    }, this.options.defaultProps, params);

    const ComponentClass = this.options.getComponentClass(props);
    const componentElement = React.createElement(ComponentClass, props);

    // The router exposes the instance of the currently rendered component
    this.rootComponent = ReactDOM.render(componentElement,
                                         this.options.container);

    if (_.isFunction(this.options.onChange)) {
      this.options.onChange.call(this, props);
    }
  }

  getCurrentLocation() {
    return window.location.href;
  }

  bindPopStateEvent() {
    window.addEventListener('popstate', this.onPopState);
  }

  unbindPopStateEvent() {
    window.removeEventListener('popstate', this.onPopState);
  }

  pushHistoryState(state, url) {
    window.history.pushState(state, '', url);
  }

  isPushStateSupported() {
    return !!window.history.pushState;
  }
}

module.exports = Router;
