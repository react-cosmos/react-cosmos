Cosmos.Router = function(options) {
  // The Router defaults are dynamic values they must be read whenever an
  // instance is created, thus they are not embedded in the Class prototype
  this.options = _.extend({
    props: Cosmos.url.getParams(),
    container: document.body,
    transition: null
  }, options);
  // defaultsProps is not applied when props are missing, but when they are
  // empty (regardless if they come from options or the default Rotuer props)
  if (_.isEmpty(this.options.props) && this.options.defaultProps) {
    this.options.props = this.options.defaultProps;
  }
  this.container = this.options.container;
  this._onPopState = this._onPopState.bind(this);
  this._bindPopStateEvent();
  this._replaceInitialState(this.options.props);
  // The initial render is done when the Router is instantiated
  this._resetHistory();
  this._loadEntry({props: this.options.props});
};
_.extend(Cosmos.Router, {
  CONTAINER_CLASS: 'cosmos-component-container',
  prototype: {
    stop: function() {
      this._unbindPopStateEvent();
    },
    goTo: function(href, originBounds) {
      // Old-school refreshes are made when pushState isn't supported
      if (!Cosmos.url.isPushStateSupported()) {
        window.location = href;
        return;
      }
      var queryString = href.split('?').pop(),
          props = Cosmos.serialize.getPropsFromQueryString(queryString);
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
      this.history = new Cosmos.RouterHistory();
      this._currentComponent = null;
      this._resetContainer();
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
      if (transitionType == Cosmos.RouterHistory.transitionTypes.NOOP) {
        return;
      }
      // We always fetch the current entry after pushing it, because it can
      // differ from the one pushed. See how RouterHistory works
      historyEntry = this.history[this.history.index];
      // We only need separate containers for transitions. Static routing will
      // reuse a single container
      var componentContainer =
        this.options.transition ?
        this._createComponentContainer(historyEntry.queryString) :
        this.container;
      // We need a reference to the current Component in order to generate an
      // up-to-date snapshot of it before loading a new Component, for caching
      // purposes, when navigating between Components
      this._currentComponent =
        Cosmos.render(historyEntry.props, componentContainer, function() {
          // Add the new component to DOM only after it successfully renders
          // for the first time
          $(this.container).append(componentContainer);
          this._transitionComponentContainer(componentContainer, transitionType);
        }.bind(this));
    },
    _transitionComponentContainer: function(componentContainer, transitionType) {
      if (!this.options.transition) {
        return;
      }
      new this.options.transition({
        prevContainer: $(componentContainer).prev().get(0),
        nextContainer: componentContainer,
        history: this.history,
        transitionType: transitionType
      });
    },
    _resetContainer: function() {
      // The Router container must only host Component containers
      $(this.container).empty();
    },
    _createComponentContainer: function(queryString) {
      $container = $('<div class="' + Cosmos.Router.CONTAINER_CLASS + '"></div>');
      return $container.get(0);
    },
    _replaceHistoryState: function(props, href) {
      window.history.replaceState(props, '', href);
    },
    _pushHistoryState: function(state, href) {
      window.history.pushState(state, '', href);
    }
  }
});
