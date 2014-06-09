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
    return this.components[name];
  }
});
