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

fresh.url = {
  getParams: function () {
    var str = window.location.search.substr(1),
        params = {};
    if (str) {
      var pairs = str.split('&'),
          parts,
          key,
          value;
      for (var i = 0; i < pairs.length; i++) {
        parts = pairs[i].split('=');
        key = parts[0];
        value = parts[1];
        if (key == 'state') {
          value = JSON.parse(decodeURIComponent(value));
        }
        params[key] = value;
      }
    }
    return params;
  }
};

fresh.mixins.DataManagerMixin = {
  loadCommentsFromServer: function() {
    var url = this.props.data;
    $.ajax({
      url: url,
      dataType: 'json',
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(url, status, err.toString());
      }.bind(this)
    });
  },
  getDefaultProps: function() {
    return {
      // Enable polling by setting a value bigger than zero, in ms
      pollInterval: 0
    };
  },
  getInitialState: function() {
    return {data: []};
  },
  componentWillMount: function() {
    // Allow passing a serialized snapshot of a state through the props
    if (this.props.state) {
      this.replaceState(this.props.state);
    }
    // The data prop points to a source of data than will extend the initial
    // state of the widget, once it will be fetched
    if (!this.props.data) {
      return;
    }
    this.loadCommentsFromServer();
    if (this.props.pollInterval) {
      this.setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    }
  }
};

fresh.mixins.SetIntervalMixin = {
  componentWillMount: function() {
    this.intervals = [];
  },
  setInterval: function() {
    this.intervals.push(setInterval.apply(null, arguments));
  },
  componentWillUnmount: function() {
    this.intervals.map(clearInterval);
  }
};

/** @jsx React.DOM */

fresh.widgets.Author = React.createClass({
  /**
   * Input: {
   *   widget: 'Author',
   *   name: 'Dan Ciotu'
   * }
   */
  mixins: [fresh.mixins.SetIntervalMixin,
           fresh.mixins.DataManagerMixin],
  render: function() {
    return (
      React.DOM.div(null, this.state.data.name)
    );
  }
});

/** @jsx React.DOM */

fresh.widgets.List = React.createClass({
  /**
   * Input: {
   *   widget: 'List',
   *   data: 'http://localhost/static/users.json'
   * }
   */
  mixins: [fresh.mixins.SetIntervalMixin,
           fresh.mixins.DataManagerMixin],
  render: function() {
    return (
      React.DOM.ul( {className:"List"}, 
        this.state.data.map(function(item, index) {
          var itemWidget = fresh.getWidgetByName(item.widget);
          return React.DOM.li( {key:index}, itemWidget(item))
        })
      )
    );
  }
});
