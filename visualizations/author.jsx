/** @jsx React.DOM */

var Author = React.createClass({
  render: function() {
    return (
      <li>{this.props.name}</li>
    );
  }
});
