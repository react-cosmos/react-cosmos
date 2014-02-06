/** @jsx React.DOM */

var fresh = {
  getWidgetByName: function(widgetName) {
    return window[widgetName];
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
