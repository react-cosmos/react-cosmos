var Cosmos = function(props) {
  var component = Cosmos.getComponentByName(props.component);
  if (!component) {
    throw new Error('Invalid component: ' + props.component);
  }
  return component(_.clone(props));
};

// Enable Node.js compatibility
if (typeof module !== 'undefined' && module.exports) {
  var React = require('react'),
      _ = require('underscore'),
      $ = require('jquery');
  module.exports = Cosmos;
}

_.extend(Cosmos, {
  mixins: {},
  components: {},
  start: function(options) {
    return new this.Router(options);
  },
  render: function(props, container) {
    var componentInstance = this(props);
    if (container) {
      return React.renderComponent(componentInstance, container);
    } else {
      return React.renderComponentToString(componentInstance);
    }
  },
  getComponentByName: function(name) {
    return this.components[name];
  }
});
