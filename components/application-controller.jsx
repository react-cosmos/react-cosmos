/** @jsx React.DOM */

var ApplicationController = React.createClass({
  render: function() {
    var widget = window[this.props.widget];
    if (!widget) {
      return (<h1>404</h1>);
    }
    return (widget(this.props));
  }
});
