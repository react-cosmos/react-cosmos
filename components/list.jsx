/** @jsx React.DOM */

Cosmos.components.List = React.createClass({
  /**
   * {
   *   component: 'List',
   *   dataUrl: 'http://localhost/static/users.json'
   * }
   */
  mixins: [Cosmos.mixins.ClassName,
           Cosmos.mixins.DataFetch,
           Cosmos.mixins.PersistState],
  defaultClass: 'list',
  initialData: [],
  render: function() {
    return (
      <ul className={this.getClassName()}>
        {this.state.data.map(function(item, index) {
          var itemComponent = Cosmos.getComponentByName(item.component);
          return <li key={index}>{itemComponent(_.clone(item))}</li>
        })}
      </ul>
    );
  }
});
