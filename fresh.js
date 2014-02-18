var Fresh = {
  mixins: {},
  components: {},
  getComponentByName: function(name) {
    return this.components[name];
  },
  start: function(rootProps, container) {
    var component = this.getComponentByName(rootProps.component),
        content;
    if (!component) {
      return;
    }
    React.renderComponent(component(_.clone(rootProps)), container);
  }
};

// Enable Node.js compatibility
if (typeof module !== 'undefined' && module.exports) {
  var React = require('react'),
      _ = require('underscore'),
      $ = require('jquery');
  module.exports = Fresh;
}
