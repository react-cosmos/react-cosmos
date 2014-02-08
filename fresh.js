var fresh = {
  mixins: {},
  widgets: {},
  getWidgetByName: function(widgetName) {
    return this.widgets[widgetName];
  },
  start: function(rootProps, container) {
    var widget = this.getWidgetByName(rootProps.widget),
        content;
    if (!widget) {
      return;
    }
    React.renderComponent(widget(rootProps), container);
  }
};

// Enable Node.js compatibility
if (typeof module !== 'undefined' && module.exports) {
  var React = require('react-tools').React;
  module.exports = fresh;
}
