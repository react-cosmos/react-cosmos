/** @jsx React.DOM */

Fresh.components.List = React.createClass({
  /**
   * {
   *   component: 'List',
   *   data: 'http://localhost/static/users.json'
   * }
   */
  mixins: [Fresh.mixins.ClassName,
           Fresh.mixins.DataManager,
           Fresh.mixins.PersistState],
  defaultClass: 'list',
  initialData: [],
  render: function() {
    return (
      <ul className={this.getClassName()}>
        {this.state.data.map(function(item, index) {
          var itemComponent = Fresh.getComponentByName(item.component);
          return <li key={index}>{itemComponent(_.clone(item))}</li>
        })}
      </ul>
    );
  }
});
