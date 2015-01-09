var Cosmos = function(props) {
  var component = Cosmos.getComponentByName(props.component,
                                            props.componentLookup);
  if (!component) {
    throw new Error('Invalid component: ' + props.component);
  }
  return component(_.cloneDeep(props));
  // Preserve received props object
};

_.extend(Cosmos, {
  mixins: {},
  components: {},
  transitions: {},
  start: function(options) {
    return new this.Router(options);
  },
  render: function(props, container, callback) {
    var componentInstance = this(props);
    if (container) {
      return React.renderComponent(componentInstance, container, callback);
    } else {
      return React.renderComponentToString(componentInstance);
    }
  },
  getComponentByName: function(name, componentLookup) {
    if (typeof(componentLookup) == 'function') {
      return componentLookup(name);
    }
    return this.components[name];
  }
});
