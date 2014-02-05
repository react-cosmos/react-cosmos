/** @jsx React.DOM */

var Timeline = React.createClass({
  mixins: [SetIntervalMixin, DataManagerMixin],
  render: function() {
    var listNodes = this.state.data.map(function (item) {
      return <li>{item.name}</li>;
    });
    return (
      <ul className="Timeline">
        {listNodes}
      </ul>
    );
  }
});
