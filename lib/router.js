Fresh.Router = function(options) {
  this.container = options.container;
  this._onPopState = this._onPopState.bind(this);
  this._bindPopStateEvent();
  this._replaceInitialState(options.props);
  // The initial render is done when the Router is instantiated
  this._resetHistory();
  this._loadEntry({props: options.props});
};
Fresh.Router.CONTAINER_CLASS = 'fresh-component-container';
Fresh.Router.prototype = {
  stop: function() {
    this._unbindPopStateEvent();
  },
  goTo: function(href, originBounds) {
    // Old-school refreshes are made when pushState isn't supported
    if (!Fresh.url.isPushStateSupported()) {
      window.location = href;
      return;
    }
    var queryString = href.split('?').pop(),
        props = Fresh.serialize.getPropsFromQueryString(queryString);
    // Calling pushState doesn't trigger the onpopstate event, so push state
    // events and programatic Router calls are individually handled
    // https://developer.mozilla.org/en-US/docs/Web/API/window.onpopstate
    this._pushHistoryState(props, href);
    this._loadEntry({
      props: props,
      originBounds: originBounds
    });
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
    if (!e.state) {
      return;
    }
    // e.state only stores the props of a RouterHistory entry. Storing other
    // meta data like originBounds would be pointless because we can't know
    // whether a BACK or FORWARD action triggered the event, once the browser
    // instance is refreshed and the RouterHistory instance is lost. Moreover,
    // seeing how we can't tell the transition type of a PopState browser
    // event, we keep resetting the entire history until encountering entries
    // that we already cached in the current RouterHistory instance.
    if (this.history.length && !this.history.canReusePropsInHistory(e.state)) {
      this._resetHistory();
    }
    this._loadEntry({props: e.state});
  },
  _replaceInitialState: function(props) {
    // The initial state must contain the history entry of the first loaded
    // Component for when the users go Back in the browser
    this._replaceHistoryState(props, window.location.href);
  },
  _resetHistory: function() {
    this.history = new Fresh.RouterHistory();
    this._currentComponent = null;
    this._resetContainer();
    this._zIndex = 0;
  },
  _loadEntry: function(historyEntry) {
    // The history entry for the previous Component is updated with its lastest
    // props and state, so that we resume it its exact form when/if going back
    if (this._currentComponent)  {
      this.history[this.history.index].props =
        this._currentComponent.generateSnapshot();
    }
    var transitionType = this.history.push(historyEntry);
    // Pushing an identical history entry is ignored
    if (transitionType == Fresh.RouterHistory.transitionTypes.NOOP) {
      return;
    }
    // We always fetch the current entry after pushing it, because it can
    // differ from the one pushed. See how RouterHistory works
    historyEntry = this.history[this.history.index];
    // Normally the global container should only have one child, unless two
    // transitions occur at the same time
    var container = this._createComponentContainer(historyEntry.queryString);
    // We need a reference to the current Component in order to generate an
    // up-to-date snapshot of it before loading a new Component, for caching
    // purposes, when navigating between Components
    this._currentComponent = Fresh.render(historyEntry.props, container);
    this._transitionComponentContainer(transitionType, container);
  },
  _resetContainer: function() {
    // The Router container must only host Component containers
    $(this.container).empty();
  },
  _createComponentContainer: function(queryString) {
    $container = $('<div class="' + Fresh.Router.CONTAINER_CLASS + '"></div>')
                 .css('z-index', ++this._zIndex);
    return $container.get(0);
  },
  _transitionComponentContainer: function(transitionType, container) {
    $(this.container).append(container);
    // Do nothing on first Components, their container is visible by default
    if (transitionType == Fresh.RouterHistory.transitionTypes.INITIAL) {
      return;
    }
    // The next container will always be inserted after of the previous in the
    // DOM tree, even when going backwards in history. We use z-index to place
    // them on top of eachother
    var $next = $(container),
        $prev = $next.prev(),
        rect = {
          width: $(this.container).width(),
          height: $(this.container).height()
        },
        transitionAnchors = this._getTransitionAnchors(rect, transitionType);
    // Previous containers need to be on front when going back, to simulate the
    // same visual hierarchy from the inverse forward transition
    if (transitionType == Fresh.RouterHistory.transitionTypes.BACK) {
      $prev.css('z-index', this._zIndex + 1);
    }
    // End any currently running transitions (this will also call their
    // callback one more time with max ratio [1], ensuring previous DOM
    // containers are removed when adding new ones)
    if (this._transition) {
      Fresh.Play.end(this._transition);
    }
    // The previous Component container will be removed at the end of the
    // transition (React GC should take over)
    this._transition = Fresh.Play.start({time: 0.5, onFrame: function(ratio) {
      var translatedPositionAndScale = this._getPositionAndScaleInTransition(
            rect, transitionAnchors, transitionType, ratio);
      $prev.css(translatedPositionAndScale.prev);
      $next.css(translatedPositionAndScale.next);
      if (transitionType == Fresh.RouterHistory.transitionTypes.BACK) {
        $prev.css('opacity', 1 - ratio);
        $next.css('opacity', 1);
      } else {
        $prev.css('opacity', 1);
        $next.css('opacity', ratio);
      }
      if (ratio == 1) {
        $prev.remove();
      }
    }.bind(this)});
  },
  _getTransitionAnchors: function(rect, transitionType) {
    var originBounds = this._getOriginBoundsForTransition(rect, transitionType),
        deflatedScale = originBounds.width / rect.width,
        inflatedScale = 1 / deflatedScale;
    return {
      fullScreen: {
        scale: 1,
        x: 0,
        y: 0
      },
      awayFromScreen: {
        scale: deflatedScale,
        x: -originBounds.x,
        y: -originBounds.y
      },
      inFrontOfScreen: {
        scale: inflatedScale,
        x: originBounds.x,
        y: originBounds.y
      }
    };
  },
  _getPositionAndScaleInTransition: function(
    rect, transitionAnchors, transitionType, ratio) {
    if (transitionType == Fresh.RouterHistory.transitionTypes.BACK) {
      return {
        prev: Fresh.Transitions.translateRectPositionAndScale(
          rect,
          transitionAnchors.awayFromScreen,
          transitionAnchors.fullScreen,
          1 - ratio),
        next: Fresh.Transitions.translateRectPositionAndScale(
          rect,
          transitionAnchors.fullScreen,
          transitionAnchors.inFrontOfScreen,
          1 - ratio)
      };
    } else {
      return {
        prev: Fresh.Transitions.translateRectPositionAndScale(
          rect,
          transitionAnchors.fullScreen,
          transitionAnchors.inFrontOfScreen,
          ratio),
        next: Fresh.Transitions.translateRectPositionAndScale(
          rect,
          transitionAnchors.awayFromScreen,
          transitionAnchors.fullScreen,
          ratio)
      };
    }
  },
  _getOriginBoundsForTransition: function(rect, transitionType) {
    var historyIndex =
      transitionType == Fresh.RouterHistory.transitionTypes.BACK ?
      this.history.index + 1 :
      this.history.index;
    return this.history[historyIndex].originBounds;
  },
  _replaceHistoryState: function(props, href) {
    window.history.replaceState(props, '', href);
  },
  _pushHistoryState: function(state, href) {
    window.history.pushState(state, '', href);
  }
};
