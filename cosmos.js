var Cosmos = function(props) {
  // XXX: Deprecated, remove in future versions
  return Cosmos.createElement(props);
};

_.extend(Cosmos, {
  mixins: {},
  components: {},
  transitions: {},

  start: function(defaultProps, options) {
    return new this.Router(defaultProps, options);
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

    if (!_.isFunction(ComponentClass)) {
      throw new Error('Invalid component: ' + props.component);
    }

    return React.createElement(ComponentClass, props);
  },

  getComponentByName: function(name, componentLookup) {
    if (_.isFunction(componentLookup)) {
      var ComponentClass = componentLookup(name);

      // Fall back to the Cosmos.components namespace if the lookup doesn't
      // return anything. Needed for exposing built-in components in Cosmos
      if (ComponentClass) {
        return ComponentClass;
      };
    }

    return this.components[name];
  }
});
