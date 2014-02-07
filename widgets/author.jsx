/** @jsx React.DOM */

fresh.widgets.Author = React.createClass({
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
