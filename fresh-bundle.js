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
  var React = require('react-tools').React,
      _ = require('underscore'),
      $ = require('jquery');
  module.exports = Fresh;
}

Fresh.serialize = {
  getPropsFromQueryString: function(queryString) {
    var props = {};
    if (queryString.length) {
      var pairs = queryString.split('&'),
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
        props[key] = value;
      }
    }
    return props;
  },
  getQueryStringFromProps: function(props) {
    var parts = [],
        value;
    for (var key in props) {
      value = props[key];
      // Objects can be embedded in a query string as well
      if (typeof value == 'object') {
        value = encodeURIComponent(JSON.stringify(value));
      }
      parts.push(key + '=' + value);
    }
    return parts.join('&');
  }
};

Fresh.url = {
  getParams: function () {
    return Fresh.serialize.getPropsFromQueryString(
      window.location.search.substr(1));
  }
};

Fresh.mixins.DataManager = {
  fetchDataFromServer: function() {
    var url = this.props.data;
    $.ajax({
      url: url,
      dataType: 'json',
      success: function(data) {
        this.receiveDataFromServer(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(url, status, err.toString());
      }.bind(this)
    });
  },
  receiveDataFromServer: function(data) {
    this.setState({data: data});
  },
  getDefaultProps: function() {
    return {
      // Enable polling by setting a value bigger than zero, in ms
      pollInterval: 0
    };
  },
  componentWillMount: function() {
    // The data prop points to a source of data than will extend the initial
    // state of the component, once it will be fetched
    // TODO: Fetch data again when props change at componentWillReceiveProps
    if (!this.props.data) {
      return;
    }
    this.fetchDataFromServer();
    if (this.props.pollInterval) {
      this.setInterval(this.fetchDataFromServer, this.props.pollInterval);
    }
  }
};

Fresh.mixins.PersistState = {
  generateConfigurationSnapshot: function() {
    var defaultProps = this.getDefaultProps ? this.getDefaultProps() : {},
        props = {},
        value,
        state;
    for (var key in this.props) {
      value = this.props[key];
      // Ignore "system" props
      if (key == '__owner__' ||
        // Current state should be used instead of initial one
        key == 'state') {
        continue;
      }
      // No point in embedding default props
      if (defaultProps.hasOwnProperty(key) && defaultProps[key] == value) {
        continue;
      }
      props[key] = value;
    }
    state = _.clone(this.state);
    // No need to embed data if we have an URL to fetch it from
    if (state && state.data && props.data) {
      delete state.data;
    }
    if (!_.isEmpty(state)) {
      props.state = state;
    }
    return props;
  },
  getUriQueryString: function() {
    return Fresh.serialize.getQueryStringFromProps(
      this.generateConfigurationSnapshot());
  },
  componentWillMount: function() {
    // Allow passing a serialized snapshot of a state through the props
    // TODO: Replace state when props change at componentWillReceiveProps
    if (this.props.state) {
      this.replaceState(this.props.state);
    }
  }
};

Fresh.mixins.SetInterval = {
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

Fresh.components.Author = React.createClass({
  /**
   * Input: {
   *   component: 'Author',
   *   name: 'Dan Ciotu'
   * }
   */
  mixins: [Fresh.mixins.SetInterval,
           Fresh.mixins.PersistState,
           Fresh.mixins.DataManager],
  render: function() {
    return (
      React.DOM.div(null, this.state.data.name)
    );
  }
});

/** @jsx React.DOM */

Fresh.components.List = React.createClass({
  /**
   * Input: {
   *   component: 'List',
   *   data: 'http://localhost/static/users.json'
   * }
   */
  mixins: [Fresh.mixins.SetInterval,
           Fresh.mixins.PersistState,
           Fresh.mixins.DataManager],
  getInitialState: function() {
    return {data: []};
  },
  render: function() {
    return (
      React.DOM.ul( {className:"List"}, 
        this.state.data.map(function(item, index) {
          var itemComponent = Fresh.getComponentByName(item.component);
          return React.DOM.li( {key:index}, itemComponent(_.clone(item)))
        })
      )
    );
  }
});
