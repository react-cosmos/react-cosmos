var Cosmos = function(props) {
  // XXX: Deprecated, remove in future versions
  return Cosmos.createElement(props);
};

_.extend(Cosmos, {
  mixins: {},
  components: {},
  transitions: {},

  start: function(defaultProps, container) {
    return new this.Router(defaultProps, container);
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
