var React = require('react/addons'),
    utils = React.addons.TestUtils;

module.exports = function(componentClass, props) {
  var componentElement = React.createElement(componentClass, props);
  return utils.renderIntoDocument(componentElement);
};
