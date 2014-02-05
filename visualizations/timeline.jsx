/** @jsx React.DOM */

var Timeline = React.createClass({
  mixins: [SetIntervalMixin, DataManagerMixin],
  render: function() {
    var itemWidget = window[this.props.item];
    return (
      <ul className="Timeline">
        {this.state.data.map(function(item, index) {
          return itemWidget($.extend({key: index}, item));
        })}
      </ul>
    );
  }
});
