Fresh.mixins.PersistState = {
  generateSnapshot: function() {
    var defaultProps = this.getDefaultProps ? this.getDefaultProps() : {},
        props = {},
        value,
        state;
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
    return props;
  },
  componentWillMount: function() {
    // Allow passing a serialized snapshot of a state through the props
    // TODO: Replace state when props change at componentWillReceiveProps
    if (this.props.state) {
      this.replaceState(this.props.state);
    }
  }
};
