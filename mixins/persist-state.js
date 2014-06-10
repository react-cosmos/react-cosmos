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
    var defaultProps = this.getDefaultProps ? this.getDefaultProps() : {},
        props = {},
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
      // No point in embedding default props
      if (defaultProps.hasOwnProperty(key) && defaultProps[key] == value) {
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
  loadChild: function(ref) {
    var childProps = this.getChildProps(ref);
    // Children are optional
    return childProps ? Cosmos(childProps) : null;
  },
  getChildProps: function(ref) {
    // The .children object on a Component class contains a hash of functions.
    // Keys in this hash correspond with *refs* of child Components and their
    // values are functions that return props for each of those child Components.
    var props = this.children[ref].call(this);
    if (!props) {
      return;
    }
    // A tree of states can be embeded inside a single (root) Component input,
    // trickling down recursively all the way to the tree leaves. Child states
    // are set inside the .children key of the parent Component's state, as a
    // hash with keys corresponding to Component *refs*. These preset states
    // will be overriden with those generated at run-time.
    if (this._childSnapshots && this._childSnapshots[ref]) {
      props.state = this._childSnapshots[ref];
      // Child snapshots are only used for first render after which organic
      // states are formed
      delete this._childSnapshots[ref];
    }
    props.ref = ref;
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
