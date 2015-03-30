var React = require('react/addons');

module.exports = React.createClass({
  render: function() {
    return <button type="button"
                   disabled={this.props.disabled}>
      Click and let click
    </button>;
  }
});
