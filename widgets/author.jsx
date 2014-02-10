/** @jsx React.DOM */

Fresh.widgets.Author = React.createClass({
  /**
   * Input: {
   *   widget: 'Author',
   *   name: 'Dan Ciotu'
   * }
   */
  mixins: [Fresh.mixins.SetInterval,
           Fresh.mixins.DataManager],
  render: function() {
    return (
      <div>{this.state.data.name}</div>
    );
  }
});
