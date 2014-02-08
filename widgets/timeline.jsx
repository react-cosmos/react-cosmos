/** @jsx React.DOM */

fresh.widgets.List = React.createClass({
  /**
   * Input: {
   *   widget: 'List',
   *   data: 'http://localhost/static/users.json'
   * }
   */
  mixins: [fresh.mixins.SetIntervalMixin,
           fresh.mixins.DataManagerMixin],
  render: function() {
    return (
      <ul className="List">
        {this.state.data.map(function(item, index) {
          var itemWidget = fresh.getWidgetByName(item.widget);
          return <li key={index}>{itemWidget(item)}</li>
        })}
      </ul>
    );
  }
});
