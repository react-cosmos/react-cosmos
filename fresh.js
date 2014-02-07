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
