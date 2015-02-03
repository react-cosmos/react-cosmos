Cosmos.mixins.PersistState = {
  /**
   * Heart of the Cosmos framework. Enables dumping a state object into a
   * component and exporting the current state.
   *
   * Props:
   *   - state: An object that will be poured inside the initial component
   *            state as soon as it loads (replacing any default state.)
   */
  serialize: function(recursive) {
    /**
     * Generate a snapshot of the component props (including current state.)
     * It excludes internal props set by React during run-time and props with
     * default values.
     */
    var snapshot = {},
        value;

    for (var key in this.props) {
      value = this.props[key];

      // Ignore "system" props
      if (key == '__owner__' ||
          // Current state should be used instead of initial one
          key == 'state') {
        continue;
      }

      snapshot[key] = value;
    }

    var state = _.clone(this.state) || {},
        children = {},
        childSnapshot;

    if (recursive) {
      _.each(this.refs, function(instance, ref) {
        // The child component needs to implement the PeristState mixin to be
        // able to serialize its children recursively as well
        if (_.isFunction(instance.serialize)) {
          childSnapshot = instance.serialize(true);

          if (!_.isEmpty(childSnapshot.state)) {
            children[ref] = childSnapshot.state;
          }
        }
      });

      if (!_.isEmpty(children)) {
        state.children = children;
      }
    }

    // There's no point in attaching the state key if the component nor its
    // children have any state
    if (!_.isEmpty(state)) {
      snapshot.state = state;
    }

    return snapshot;
  },

  loadChild: function() {
    var childProps = this.getChildProps.apply(this, arguments);

    if (childProps) {
      try {
        return Cosmos.createElement(childProps);
      } catch (e) {
        console.error(e);
      }
    }

    // Return null won't render any node
    return null;
  },

  getChildProps: function(name) {
    /**
     * @param {String} name Key that corresponds to the child component we want
     *                      to get the props for
     * @param {...*} [arguments] Optional extra arguments get passed to the
     *                           function that returns the component props
     */
    // https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#32-leaking-arguments
    var args = [];
    for (var i = 1; i < arguments.length; ++i) {
      args[i - 1] = arguments[i];
    }

    // The .children object on a component class contains a hash of functions.
    // Keys in this hash represent the name and by default the *refs* of child
    // components (unless changed via optional arguments passed in) and their
    // values are functions that return props for each of those child
    // components.
    var props = this.children[name].apply(this, args);
    if (!props) {
      return;
    }

    if (!props.ref) {
      props.ref = name;
    }

    // A tree of states can be embeded inside a single (root) component input,
    // trickling down recursively all the way to the tree leaves. Child states
    // are set inside the .children key of the parent component's state, as a
    // hash with keys corresponding to component *refs*. These preset states
    // will be overriden with those generated at run-time.
    if (this._childSnapshots && this._childSnapshots[name]) {
      props.state = this._childSnapshots[name];
    }

    if (this.props.componentLookup) {
      props.componentLookup = this.props.componentLookup;
    }

    return props;
  },

  componentWillMount: function() {
    // Allow passing of a serialized state snapshot through props
    if (this.props.state) {
      this._loadStateSnapshot(this.props.state);
    }
  },

  componentDidMount: function() {
    this._clearChildSnapshots();
  },

  _loadStateSnapshot: function(newState) {
    // Child snapshots are read and flushed on every render (through the
    // .children functions)
    if (newState.children) {
      this._childSnapshots = newState.children;
    }

    var defaultState = {};

    // Allowing the new state to extend the initial set improves the brevity
    // of component fixtures
    if (_.isFunction(this.getInitialState)) {
      _.extend(defaultState, this.getInitialState());
    }

    this.replaceState(_.merge(defaultState, newState));
  },

  _clearChildSnapshots: function() {
    // Child snapshots are only used for first render after which organic
    // states are formed
    if (this._childSnapshots !== undefined) {
      this._childSnapshots = undefined;
    }
  }
};
