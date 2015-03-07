var _ = require('lodash'),
    Cosmos = require('../cosmos.js');

module.exports = {
  /**
   * Heart of the Cosmos framework. Links components with their children
   * recursively. This makes it possible to inject nested state intro a tree of
   * compoents, as well as serializing them into a single snapshot.
   */
  serialize: function(recursive) {
    /**
     * Generate a snapshot with the the props and state of a component
     * combined, including the state of all nested child components.
     */
    // Current state should be used instead of initial one
    var snapshot = _.omit(this.props, 'state'),
        // Omit any child state that was previously passed through props
        state = _.omit(this.state, 'children'),
        children = {},
        childSnapshot;

    if (recursive) {
      _.each(this.refs, function(child, ref) {
        // We can only nest child state if the child component also uses the
        // ComponentTree mixin
        if (_.isFunction(child.serialize)) {
          childSnapshot = child.serialize(true);

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
    if (this._childSnapshots && this._childSnapshots[props.ref]) {
      props.state = this._childSnapshots[props.ref];
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

    this.replaceState(_.extend(defaultState, newState));
  },

  _clearChildSnapshots: function() {
    // Child snapshots are only used for first render after which organic
    // states are formed
    if (this._childSnapshots !== undefined) {
      this._childSnapshots = undefined;
    }
  }
};
