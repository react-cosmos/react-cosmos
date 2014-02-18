var Fresh = {
  mixins: {},
  components: {},
  getComponentByName: function(name) {
    return this.components[name];
  },
  render: function(props, container) {
    var component = this.getComponentByName(props.component);
    if (!component) {
      throw new Error('Invalid component: ' + props.component);
    }
    var componentInstance = component(_.clone(props));
    if (container) {
      return React.renderComponent(componentInstance, container);
    } else {
      return React.renderComponentToString(componentInstance);
    }
  }
};

// Enable Node.js compatibility
if (typeof module !== 'undefined' && module.exports) {
  var React = require('react'),
      _ = require('underscore'),
      $ = require('jquery');
  module.exports = Fresh;
}
