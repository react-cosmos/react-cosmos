/** @jsx React.DOM */

Fresh.components.Author = React.createClass({
  /**
   * Input: {
   *   component: 'Author',
   *   name: 'Dan Ciotu'
   * }
   */
  mixins: [Fresh.mixins.SetInterval,
           Fresh.mixins.PersistState,
           Fresh.mixins.DataManager],
  render: function() {
    return (
      <div>{this.state.data.name}</div>
    );
  }
});
