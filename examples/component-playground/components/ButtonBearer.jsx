var React = require('react'),
    SimpleButton = require('./SimpleButton.jsx');

module.exports = React.createClass({
  render: function() {
    return <p>I bear a simple button <SimpleButton ref="button" /></p>
  }
});
