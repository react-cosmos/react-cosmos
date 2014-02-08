/** @jsx React.DOM */

Fresh.widgets.Author = React.createClass({
  /**
   * Input: {
   *   widget: 'Author',
   *   name: 'Dan Ciotu'
   * }
   */
  mixins: [Fresh.mixins.SetIntervalMixin,
           Fresh.mixins.DataManagerMixin],
  render: function() {
    return (
      <div>{this.state.data.name}</div>
    );
  }
});
