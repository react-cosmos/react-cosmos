var _ = require('lodash'),
    React = require('react/addons'),
    router = require('./lib/router.js');

module.exports = {
  start: function(options) {
    return new router.Router(_.extend({
      onRender: this.render.bind(this)
    }, options));
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
    var ComponentClass = props.componentLookup(props.component);

    if (!_.isFunction(ComponentClass)) {
      throw new Error('Invalid component: ' + props.component);
    }

    return React.createElement(ComponentClass, props);
  }
};
