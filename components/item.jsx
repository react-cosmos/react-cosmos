/** @jsx React.DOM */

Fresh.components.Item = React.createClass({
  /**
   * {
   *   component: 'Item',
   *   name: 'Catalin Miron',
   *   age: '26'
   * }
   */
  mixins: [Fresh.mixins.ClassName,
           Fresh.mixins.DataFetch,
           Fresh.mixins.PersistState,
           Fresh.mixins.Url],
  render: function() {
    var itemNodes = [];
    for (var key in this.state.data) {
      itemNodes.push(<p>{key + ': '}<strong>{this.state.data[key]}</strong></p>);
    }
    return (
      <div className={this.getClassName()}>
        <a href={this.getUrlFromProps(this.generateSnapshot())}
           onClick={this.routeLink}>Maximize</a>
        {itemNodes}
      </div>
    );
  }
});
