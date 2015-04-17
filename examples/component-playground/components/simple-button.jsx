var React = require('react/addons');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      clicks: 0
    };
  },

  render: function() {
    return <button type="button"
                   disabled={this.props.disabled}
                   onClick={this.onClick}>
      {this.state.clicks == 0 ? 'Click and let click' :
           this.state.clicks === 1 ? 'Clicked once' :
               'Clicked ' + this.state.clicks + ' times'}
    </button>;
  },

  onClick: function() {
    this.setState({clicks: ++this.state.clicks});
  }
});
