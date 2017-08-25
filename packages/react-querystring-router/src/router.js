import React from 'react';
import ReactDOM from 'react-dom';
import { parseLocation } from './uri';

const getCurrentLocation = () => window.location.href;

class Router {
  constructor(options) {
    this.options = options;

    this.routeLink = this.routeLink.bind(this);
    this.onPopState = this.onPopState.bind(this);

    window.addEventListener('popstate', this.onPopState);

    // The initial render is done instantly when the Router instance is created
    this.loadParams(parseLocation(getCurrentLocation()));
  }

  stop() {
    window.removeEventListener('popstate', this.onPopState);
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
    const location = getCurrentLocation();
    const params = parseLocation(location);

    this.loadParams(params);
  }

  pushLocation(location) {
    // Old-school refreshes are made when pushState isn't supported
    if (!window.history.pushState) {
      window.location = location;
      return;
    }

    // Create a history entry for the new component
    window.history.pushState({}, '', location);

    this.loadParams(parseLocation(location));
  }

  loadParams(params) {
    const {
      getComponentClass,
      getComponentProps,
      container,
      onChange
    } = this.options;
    const ComponentClass = getComponentClass(params);
    const props = {
      ...getComponentProps(params),
      // Always send the components a reference to the router. This makes it
      // possible for a component to change the page through the router and
      // not have to rely on any sort of globals
      // TODO: Send only methods instead
      router: this
    };
    const componentElement = React.createElement(ComponentClass, props);

    ReactDOM.render(componentElement, container);

    if (typeof onChange === 'function') {
      onChange.call(this, params);
    }
  }
}

export default Router;
