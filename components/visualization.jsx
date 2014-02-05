/** @jsx React.DOM */

var Visualization = React.createClass({
  render: function() {
    widget = window[this.props.type];
    if (!widget) {
      return (<h1>404</h1>);
    }
    return (<div className="Visualization">{widget({data: []})}</div>);
  }
});
