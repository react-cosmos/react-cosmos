/** @jsx React.DOM */

fresh.widgets.Timeline = React.createClass({
  /**
   * Input: {
   *   widget: 'Timeline',
   *   item: 'Author',
   *   data: 'http://localhost/static/users.json'
   * }
   */
  mixins: [fresh.mixins.SetIntervalMixin,
           fresh.mixins.DataManagerMixin],
  render: function() {
    var itemWidget = fresh.getWidgetByName(this.props.item);
    return (
      <ul className="Timeline">
        {this.state.data.map(function(item, index) {
          return <li key={index}>{itemWidget(item)}</li>
        })}
      </ul>
    );
  }
});
