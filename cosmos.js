var Cosmos = function(props) {
  // XXX: Deprecated, remove in future versions
  return Cosmos.createElement(props);
};

_.extend(Cosmos, {
  mixins: {},
  components: {},
  transitions: {},
  start: function(options) {
    return new this.Router(options);
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
    // Preserve received props object
    var clonedProps = _.cloneDeep(props);

    return React.createElement(ComponentClass, clonedProps);
  },
  getComponentByName: function(name, componentLookup) {
    if (typeof(componentLookup) == 'function') {
      return componentLookup(name);
    }
    return this.components[name];
  }
});
