Fresh.mixins.PersistState = {
  generateConfigurationSnapshot: function() {
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
    // No need to embed data if we have an URL to fetch it from
    if (state && state.data && props.data) {
      delete state.data;
    }
    if (!_.isEmpty(state)) {
      props.state = state;
    }
    return props;
  },
  getUriQueryString: function() {
    var props = this.generateConfigurationSnapshot(),
        parts = [],
        value;
    for (var key in props) {
      value = props[key];
      // Objects can be embedded in a URL query string as well
      if (typeof value == 'object') {
        value = encodeURIComponent(JSON.stringify(value));
      }
      parts.push(key + '=' + value);
    }
    return parts.join('&');
  },
  componentWillMount: function() {
    // Allow passing a serialized snapshot of a state through the props
    // TODO: Replace state when props change at componentWillReceiveProps
    if (this.props.state) {
      this.replaceState(this.props.state);
    }
  }
};
