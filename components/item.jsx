/** @jsx React.DOM */

Fresh.components.Item = React.createClass({
  /**
   * {
   *   component: 'Item',
   *   name: 'Catalin Miron',
   *   age: '26'
   * }
   */
  mixins: [Fresh.mixins.SetInterval,
           Fresh.mixins.PersistState,
           Fresh.mixins.DataManager],
  getInitialState: function() {
    return {data: {}};
  },
  render: function() {
    var itemNodes = [];
    for (var key in this.state.data) {
      itemNodes.push(<p>{key + ': '}<strong>{this.state.data[key]}</strong></p>);
    }
    return (
      <div>
        {itemNodes}
      </div>
    );
  }
});
