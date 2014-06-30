var Cosmos = function(props) {
  var component = Cosmos.getComponentByName(props.component);
  if (!component) {
    throw new Error('Invalid component: ' + props.component);
  }
  // Preserive received props object
  return component(_.cloneDeep(props));
};

_.extend(Cosmos, {
  mixins: {},
  components: {},
  transitions: {},
  componentLookups: [],
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
  getComponentByName: function(name) {
    // The order of calling the lookups is last to first registered
    var i = this.componentLookups.length,
        componentFound;
    while (--i >= 0) {
      // The context of the callback is irrelevant for now
      componentFound = this.componentLookups[i].call(this, name);
      if (componentFound) {
        return componentFound;
      }
    }
    return this.components[name];
  },
  registerComponentLookup: function(callback) {
    this.componentLookups.push(callback);
  }
});
