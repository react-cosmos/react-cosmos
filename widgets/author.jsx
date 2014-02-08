/** @jsx React.DOM */

fresh.widgets.Author = React.createClass({
  /**
   * Input: {
   *   widget: 'Author',
   *   name: 'Dan Ciotu'
   * }
   */
  mixins: [fresh.mixins.SetIntervalMixin,
           fresh.mixins.DataManagerMixin],
  render: function() {
    return (
      <div>{this.state.data.name}</div>
    );
  }
});
