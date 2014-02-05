/** @jsx React.DOM */

var Author = React.createClass({
  /**
   * Input: {
   *   widget: 'Author',
   *   name: 'Dan Ciotu'
   * }
   */
  render: function() {
    return (
      <div>{this.props.name}</div>
    );
  }
});
