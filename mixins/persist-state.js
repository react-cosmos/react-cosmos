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
        children = {},
        childrenProps;
    for (var key in this.props) {
      value = this.props[key];
      // Ignore "system" props
      if (key == '__owner__' ||
        // Current state should be used instead of initial one
        key == 'state') {
        continue;
      }
      // No point in embedding default props
      if (defaultProps.hasOwnProperty(key) && defaultProps[key] == value) {
        continue;
      }
      props[key] = value;
    }
    state = _.clone(this.state);
    if (!_.isEmpty(state)) {
      props.state = state;
    }
    if (recursive) {
      _.each(this.refs, function(instance, ref) {
        // The child component needs to implement the PeristState mixin to be
        // able to serialize its current state
        if (typeof(instance.generateSnapshot) == 'function') {
          children[ref] = instance.generateSnapshot(true);
        } else {
          childrenProps = this.getChildProps(ref);
          if (!_.isEmpty(childrenProps)) {
            children[ref] = childrenProps;
          }
        }
      }.bind(this));
      if (!_.isEmpty(children)) {
        props.children = children;
      }
    }
    return props;
  },
  loadChild: function(ref) {
    return Cosmos(this.getChildProps(ref));
  },
  getChildProps: function(ref) {
    var props = {};
    // A tree of props can be embeded inside a single (root) Component
    // input, trickling down recursively all the way to the tree leaves. Child
    // props are set inside the .children prop of the parent Component, as a
    // hash with keys corresponding to Component *refs*. These pre-defined
    // props will be overriden with those generated at run-time.
    if (this.props.children && this.props.children[ref]) {
      _.extend(props, this.props.children[ref]);
    }
    // The .children object on a Component class contains a hash of functions.
    // Keys in this hash correspond with *refs* of child Components and their
    // values are functions that return props for each of those child Components.
    if (this.children && typeof(this.children[ref]) == 'function') {
      props = this.children[ref].call(this, props);
    }
    props.ref = ref;
    return props;
  },
  componentWillMount: function() {
    // Allow passing a serialized snapshot of a state through the props
    if (this.props.state) {
      this.replaceState(this.props.state);
    }
  },
  componentWillReceiveProps: function(nextProps) {
    // A Component can have its configuration replaced at any time
    if (nextProps.state) {
      this.replaceState(nextProps.state);
    }
  }
};
