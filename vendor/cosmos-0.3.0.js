(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module
    define(['react', 'lodash', 'jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but only CommonJS-like
    // environments that support module.exports, like Node
    module.exports = factory(require('react/addons'),
                             require('lodash'),
                             require('jquery'));
  } else {
    // Browser globals (root is window)
    root.Cosmos = factory(root.React, root._, root.$);
  }
}(this, function(React, _, $) {

var Cosmos = function(props) {
  // XXX: Deprecated, remove in future versions
  return Cosmos.createElement(props);
};

_.extend(Cosmos, {
  mixins: {},
  components: {},
  transitions: {},
  start: function(options) {
    return new this.Router(options);
  },
  render: function(props, container, callback) {
    var componentInstance = this.createElement(props);
    if (container) {
      return React.render(componentInstance, container, callback);
    } else {
      return React.renderToString(componentInstance);
    }
  },
  createElement: function(props) {
    var ComponentClass = this.getComponentByName(props.component,
                                                 props.componentLookup);
    if (!ComponentClass) {
      throw new Error('Invalid component: ' + props.component);
    }
    return React.createElement(ComponentClass, props);
  },
  getComponentByName: function(name, componentLookup) {
    if (typeof(componentLookup) == 'function') {
      return componentLookup(name);
    }
    return this.components[name];
  }
});

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
      // Always send the components a reference to the router. This makes it
      // possible for a component to change the page through the router and
      // not have to rely on any sort of globals
      var props = _.extend({router: this}, this._defaultProps, newProps);

      // The router exposes the instance of the currently rendered component
      this.rootComponent = Cosmos.render(props, this._container, callback);

      // We use the current href when updating the current history entry
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
        // Ignore the Router reference because it gets attached automatically
        // when sending new props to a component
        if (key === 'router') {
          continue;
        }

        value = props[key];

        if (value !== this._defaultProps[key]) {
          newProps[key] = value;
        }
      }

      return newProps;
    }
  }
});

Cosmos.serialize = {
  getPropsFromQueryString: function(queryString) {
    var props = {};

    if (!queryString.length) {
      return props;
    }

    var pairs = queryString.split('&'),
        parts,
        key,
        value;

    for (var i = 0; i < pairs.length; i++) {
      parts = pairs[i].split('=');
      key = parts[0];
      value = decodeURIComponent(parts[1]);

      try {
        value = JSON.parse(value);
      } catch(e) {
        // If the prop was a simple type and not a stringified JSON it will
        // keep its original value
      }

      props[key] = value;
    }

    return props;
  },

  getQueryStringFromProps: function(props) {
    var parts = [],
        value;

    for (var key in props) {
      value = props[key];

      // Objects can be embedded in a query string as well
      if (typeof value == 'object') {
        try {
          value = JSON.stringify(value);
        } catch(e) {
          // Props that can't be stringified should be ignored
          continue;
        }
      }

      parts.push(key + '=' + encodeURIComponent(value));
    }

    return parts.join('&');
  }
};

Cosmos.url = {
  getParams: function() {
    return Cosmos.serialize.getPropsFromQueryString(
      window.location.search.substr(1));
  },
  
  isPushStateSupported: function() {
    return !!window.history.pushState;
  }
};

(function(Cosmos, window) {

Cosmos.mixins.AnimationLoop = {
  /**
   * Simple API for running a callback at 60fps. The callback receives a
   * *frames* argument which is equal to the number of frames passed since the
   * last call. Ideally, if the browser performs seamlessly the *frames* will
   * always be `1`. However, when the browser lags behind the value will
   * increase, akin to a frame-skipping mechanism. This way you can use the
   * *frames* value as a multiplier for a transition step.
   *
   * A requestAnimationFrame>setTimeout polyfill is used for the callbacks.
   */
  startAnimationLoop: function() {
    // Prevent running more callbacks at the same time
    this._clearAnimation();
    this._nextFrame();
    this.setState({animationLoopRunning: true});
  },
  stopAnimationLoop: function() {
    this._clearAnimation();
    this.setState({animationLoopRunning: false});
  },
  componentDidMount: function() {
    this._loadAnimationState(this.state);
  },
  componentWillReceiveProps: function(nextProps) {
    // This is a feature that only works in conjunction with the PersistState
    // mixin. Animations will be resumed or stopped based on previous states
    // loaded using setProps({state: ...})
    if (nextProps.state) {
      this._loadAnimationState(nextProps.state);
    }
  },
  componentWillUnmount: function() {
    this._clearAnimation();
  },
  _loadAnimationState: function(state) {
    // If the Component state had an on-going animation it will resume as soon
    // as a Component is mounted with the same state.
    // If the Componene state had a stopped animation it will stop any current
    // animation when overwriting state
    if (state && state.animationLoopRunning !== undefined) {
      if (state.animationLoopRunning) {
        this.startAnimationLoop();
      } else {
        this.stopAnimationLoop();
      }
    }
  },
  _nextFrame: function() {
    this._prevTime = Date.now();
    // Keep a reference to the animation request to be able to clear it on
    // stopAnimationLoop()
    this._animationRequestId = requestAnimationFrame(this._animationCallback);
  },
  _clearAnimation: function() {
    if (this._animationRequestId) {
      cancelAnimationFrame(this._animationRequestId);
      this._animationRequestId = null;
    }
  },
  _animationCallback: function() {
    if (typeof(this.onFrame) != 'function') {
      return;
    }
    var now = Date.now(),
        timePassed = now - this._prevTime,
        timeExpected = 1000 / 60;
    this.onFrame(timePassed / timeExpected);

    // Sometimes the next frame is still called even after it was canceled, so
    // we need to make sure we don't continue with the animation loop
    if (this._animationRequestId) {
      this._nextFrame();
    }
  }
};

// Polyfill inspired by Paul Irish
// http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
var requestAnimationFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(callback) {
    return window.setTimeout(callback, 1000 / 60);
  };

var cancelAnimationFrame =
  window.cancelAnimationFrame ||
  window.webkitCancelAnimationFrame ||
  window.mozCancelAnimationFrame ||
  function(requestId) {
    window.clearTimeout(requestId);
  };

})(Cosmos, this);

Cosmos.mixins.ClassName = {
  getClassName: function(defaultClassName) {
    if (this.props.className !== undefined) {
      return this.props.className;
    }
    return defaultClassName;
  }
};

Cosmos.mixins.DataFetch = {
  /**
   * Bare functionality for fetching server-side JSON data inside a Component.
   *
   * Props:
   *   - dataUrl: A URL to fetch data from. Once data is received it will be
   *              set inside the Component's state, under the data key, and
   *              will cause a reactive re-render.
   *   - pollInterval: An interval in milliseconds for polling the data URL.
   *                   Defaults to 0, which means no polling.
   *
   * Context methods:
   *  - getDataUrl: The data URL can be generated dynamically by composing it
   *                using other props, inside a custom method that receives
   *                the next props as arguments and returns the data URL. The
   *                expected method name is "getDataUrl" and overrides the
   *                dataUrl prop when implemented.
   */
  fetchDataFromServer: function(url, onSuccess) {
    this.setState({
      isFetchingData: true
    });

    var request = $.ajax({
      url: url,
      // Even though not recommended, some $.ajaxSettings might default to POST
      // requests. See http://api.jquery.com/jquery.ajaxsetup/
      type: 'GET',
      dataType: 'json',
      complete: function() {
        this.xhrRequests = _.without(this.xhrRequests, request);
      }.bind(this),
      success: onSuccess,
      error: function(xhr, status, err) {
        if (this._ignoreXhrRequestCallbacks) {
          return;
        };
        this.setState({
          isFetchingData: false
        });
        console.error(url, status, err.toString());
      }.bind(this)
    });
    this.xhrRequests.push(request);
  },
  receiveDataFromServer: function(data) {
    this.setState({
      isFetchingData: false,
      data: data
    });
  },
  _resetData: function(props) {
    /**
     * Hit the dataUrl and fetch data.
     *
     * Before starting to fetch data we reset any ongoing requests. We also
     * reset the polling interval.
     *
     * @param {Object} props
     * @param {String} props.dataUrl The URL that will be hit for data. The URL
     *     can be generated dynamically by composing it through other props,
     *     inside a custom method that receives the next props as arguments and
     *     returns the data URL. The expected method name is "getDataUrl" and
     *     overrides the dataUrl prop when implemented
     */

    var dataUrl = typeof(this.getDataUrl) == 'function' ?
                  this.getDataUrl(props) : props.dataUrl;

    // Clear any on-going polling when data is reset. Even if polling is still
    // enabled, we need to reset the interval to start from now
    this.clearDataRequests();
    if (dataUrl) {
      this.fetchDataFromServer(dataUrl, this.receiveDataFromServer);
      if (props.pollInterval) {
        this.pollInterval = setInterval(function() {
          this.fetchDataFromServer(dataUrl, this.receiveDataFromServer);
        }.bind(this), props.pollInterval);
      }
    }
  },
  refreshData: function() {
    /**
     * Hit the same data URL again.
     */

    this._resetData(this.props);
  },
  clearDataRequests: function() {
    // Cancel any on-going request and future polling
    while (!_.isEmpty(this.xhrRequests)) {
      this.xhrRequests.pop().abort();
    }
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
  },
  getDefaultProps: function() {
    return {
      // Enable polling by setting a value bigger than zero, in ms
      pollInterval: 0
    };
  },
  componentWillMount: function() {
    this.xhrRequests = [];
    // The dataUrl prop points to a source of data than will extend the initial
    // state of the component, once it will be fetched
    this._resetData(this.props);
  },
  componentWillReceiveProps: function(nextProps) {
    /**
     * A Component can have its configuration replaced at any time so we need to
     * fetch data again.
     *
     * Only fetch data if the dataUrl has changed.
     */

    if (this.props.dataUrl !== nextProps.dataUrl) {
      this._resetData(nextProps);
    }
  },
  componentWillUnmount: function() {
    // We abort any on-going requests when unmounting to make sure their
    // callbacks will no longer be called. The error callback will still be
    // called because of the abort action itself, so we use this flag to know
    // to ignore it altogether from this point on
    this._ignoreXhrRequestCallbacks = true;
    this.clearDataRequests();
  }
};

Cosmos.mixins.PersistState = {
  /**
   * Heart of the Cosmos framework. Enables dumping a state object into a
   * Component and exporting the current state.
   *
   * Props:
   *   - state: An object that will be poured inside the initial Component
   *            state as soon as it loads (replacing any default state.)
   */
  generateSnapshot: function(recursive) {
    /**
     * Generate a snapshot of the Component props (including current state.)
     * It excludes internal props set by React during run-time and props with
     * default values.
     */
    var props = {},
        value,
        state,
        children = {};
    for (var key in this.props) {
      value = this.props[key];
      // Ignore "system" props
      if (key == '__owner__' ||
        // Current state should be used instead of initial one
        key == 'state' ||
        // No reason to include parent reference
        key == 'ref') {
        continue;
      }
      props[key] = value;
    }
    props.state = _.cloneDeep(this.state) || {};
    if (recursive) {
      _.each(this.refs, function(instance, ref) {
        // The child component needs to implement the PeristState mixin to be
        // able to serialize its children recursively as well
        if (typeof(instance.generateSnapshot) == 'function') {
          children[ref] = instance.generateSnapshot(true).state;
        } else {
          children[ref] = _.cloneDeep(instance.state) || {};
        }
      });
      if (!_.isEmpty(children)) {
        props.state.children = children;
      }
    }
    return props;
  },
  loadChild: function() {
    var childProps = this.getChildProps.apply(this, arguments);
    // Children are optional
    return childProps ? Cosmos.createElement(childProps) : null;
  },
  /**
   * @param {string} name - Key that corresponds to the child Component we want
   *                        to get the props for
   * @param {...*} [arguments] - Optional extra arguments get passed to the
   *                             function that returns the Component props
   */
  getChildProps: function(name) {
    // The .children object on a Component class contains a hash of functions.
    // Keys in this hash represent the name and by default the *refs* of child
    // Components (unless changed via optional arguments passed in) and their
    // values are functions that return props for each of those child Components.
    var args = [];
    for (var i = 1; i < arguments.length; ++i) {
      args[i - 1] = arguments[i];
    }

    var props = this.children[name].apply(this, args);
    if (!props) {
      return;
    }
    // A tree of states can be embeded inside a single (root) Component input,
    // trickling down recursively all the way to the tree leaves. Child states
    // are set inside the .children key of the parent Component's state, as a
    // hash with keys corresponding to Component *refs*. These preset states
    // will be overriden with those generated at run-time.
    if (!props.ref) {
      props.ref = name;
    }
    if (this._childSnapshots && this._childSnapshots[name]) {
      props.state = this._childSnapshots[name];
      // Child snapshots are only used for first render after which organic
      // states are formed
      delete this._childSnapshots[name];
    }
    if (this.props.componentLookup) {
      props.componentLookup = this.props.componentLookup;
    }
    return props;
  },
  loadStateSnapshot: function(state) {
    if (state.children) {
      this._childSnapshots = state.children;
      delete state.children;
    }
    // Don't alter initial state object when changing state in the future
    this.replaceState(_.cloneDeep(state));
  },
  componentWillMount: function() {
    // Allow passing a serialized snapshot of a state through the props
    if (this.props.state) {
      this.loadStateSnapshot(this.props.state);
    }
  },
  componentWillReceiveProps: function(nextProps) {
    // A Component can have its configuration replaced at any time
    if (nextProps.state) {
      this.loadStateSnapshot(nextProps.state);
    }
  }
};

Cosmos.mixins.Url = {
  /**
   * Enables basic linking between Components, with optional use of the minimal
   * built-in Router.
   */
  getUrlFromProps: function(props) {
    /**
     * Serializes a props object into a browser-complient URL. The URL
     * generated can be simply put inside the href attribute of an <a> tag, and
     * can be combined with the generateSnapshot method of the PersistState
     * Mixin to create a link that opens the current Component at root level
     * (full window.)
     */
    return '?' + Cosmos.serialize.getQueryStringFromProps(props);
  },

  routeLink: function(event) {
    /**
     * Any <a> tag can have this method bound to its onClick event to have
     * their corresponding href location picked up by the built-in Router
     * implementation, which uses pushState to switch between Components
     * instead of reloading pages.
     */
    event.preventDefault();
    this.props.router.goTo(event.currentTarget.getAttribute('href'));
  }
};

/** @jsx React.DOM */
var classSet = React.addons.classSet;

Cosmos.components.ComponentPlayground = React.createClass({
  mixins: [Cosmos.mixins.PersistState,
           Cosmos.mixins.Url],

  displayName: 'ComponentPlayground',

  propTypes: {
    fixtures: React.PropTypes.object.isRequired,
    fixturePath: React.PropTypes.string,
    fullScreen: React.PropTypes.bool
  },

  getInitialState: function() {
    var expandedComponents = [];

    // Expand the relevant component when a fixture is selected
    if (this.props.fixturePath) {
      expandedComponents.push(
        this._getComponentNameFromPath(this.props.fixturePath));
    }

    return {
      expandedComponents: expandedComponents
    };
  },

  children: {
    preview: function() {
      var props = {
        component: this._getComponentNameFromPath(this.props.fixturePath)
      };

      if (this.props.router) {
        props.router = this.props.router;
      }

      var fixture = this._getFixtureContentsFromPath(this.props.fixturePath);
      return _.extend(props, fixture);
    }
  },

  render: function() {
    var classes = classSet({
      'component-playground': true,
      'full-screen': this.props.fullScreen
    });

    return (
      React.DOM.div( {className:classes}, 
        React.DOM.div( {className:"header"}, 
          this.renderFullScreenButton(),
          React.DOM.h1(null, 
            React.DOM.a( {href:"?", onClick:this.routeLink}, 
              React.DOM.span( {className:"react"}, "React"), " Component Playground"
            )
          )
        ),
        React.DOM.div( {className:"fixtures"}, 
          this.renderFixtures()
        ),
        React.DOM.div( {className:"preview"}, 
          this.props.fixturePath ? this.loadChild('preview') : null
        )
      )
    );
  },

  renderFixtures: function() {
    return React.DOM.ul( {className:"components"}, 
      _.map(this.props.fixtures, function(fixtures, componentName) {

        var classes = classSet({
          'component': true,
          'expanded':
            this.state.expandedComponents.indexOf(componentName) !== -1
        });

        return React.DOM.li( {className:classes, key:componentName}, 
          React.DOM.p( {className:"component-name"}, 
            React.DOM.a( {href:"#toggle-component",
               onClick:_.partial(this.handleComponentClick, componentName),
               ref:componentName + "Button"}, 
              componentName
            )
          ),
          this.renderComponentFixtures(componentName, fixtures)
        );

      }.bind(this))
    )
  },

  renderComponentFixtures: function(componentName, fixtures) {
    return React.DOM.ul( {className:"component-fixtures"}, 
      _.map(fixtures, function(props, fixtureName) {

        var url = this.getUrlFromProps({
          fixturePath: componentName + '/' + fixtureName
        });

        return React.DOM.li( {className:this._getFixtureClasses(fixtureName),
                   key:fixtureName}, 
          React.DOM.a( {href:url, onClick:this.routeLink}, 
            fixtureName.replace(/-/g, ' ')
          )
        );

      }.bind(this))
    );
  },

  renderFullScreenButton: function() {
    if (!this.props.fixturePath) {
      return;
    }

    var fullScreenUrl = this.getUrlFromProps({
      fixturePath: this.props.fixturePath,
      fullScreen: true
    });

    return React.DOM.a( {href:fullScreenUrl,
              className:"full-screen-button",
              ref:"fullScreenButton"}, "Fullscreen");
  },

  handleComponentClick: function(componentName, event) {
    event.preventDefault();

    var currentlyExpanded = this.state.expandedComponents,
        componentIndex = currentlyExpanded.indexOf(componentName),
        toBeExpanded;

    if (componentIndex !== -1) {
      toBeExpanded = _.clone(currentlyExpanded);
      toBeExpanded.splice(componentIndex, 1);
    } else {
      toBeExpanded = currentlyExpanded.concat(componentName);
    }

    this.setState({expandedComponents: toBeExpanded});
  },

  _getFixtureClasses: function(fixtureName) {
    var classes = {
      'component-fixture': true
    };

    var fixturePath = this.props.fixturePath;
    if (fixturePath) {
      var selectedFixtureName = this._getFixtureNameFromPath(fixturePath);
      classes['selected'] = fixtureName === selectedFixtureName;
    }

    return classSet(classes);
  },

  _getFixtureContentsFromPath: function(fixturePath) {
    var componentName = this._getComponentNameFromPath(fixturePath),
        fixtureName = this._getFixtureNameFromPath(fixturePath);

    return this.props.fixtures[componentName][fixtureName];
  },

  _getComponentNameFromPath: function(fixturePath) {
    return fixturePath.split('/')[0];
  },

  _getFixtureNameFromPath: function(fixturePath) {
    return fixturePath.substr(fixturePath.indexOf('/') + 1);
  }
});

return Cosmos;
}));
