/** @jsx React.DOM */

Cosmos.components.LandingPage = React.createClass({
  /**
   * Landing page for Cosmos framework with data alongside.
   */
  getInitialState: function() {
    return {
      snapshot: {}
    };
  },
  render: function() {
    return (
      <div className="landing-page">
        <div className="content-wrapper">
          <Cosmos component="Tetris" ref="tetris" />
        </div>
        <pre className="data-snapshot">{this.getSerializedState()}</pre>
      </div>
    );
  },
  componentDidMount: function() {
    this.refreshSnapshot();
    this._intervalId = setInterval(this.refreshSnapshot, 500);
  },
  componentWillUnmount: function() {
    clearInterval(this._intervalId);
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    return JSON.stringify(nextState.snapshot) !=
           JSON.stringify(this.state.snapshot);
  },
  refreshSnapshot: function() {
    this.setState({
      snapshot: this.refs.tetris.generateSnapshot(true)
    });
  },
  getSerializedState: function() {
    var snapshot = JSON.stringify(this.state.snapshot, null, '  ');
    // Style the Well and the active Tetrimino grid with one row per line
    snapshot = snapshot.replace(/\n([\s]+)"grid"\: ([\s\S]+?)\]([\s]+)\]/g,
      function(match, indent, grid, after) {
        grid = grid.replace(new RegExp('\\[\n' + indent + '    ', 'g'), '[');
        grid = grid.replace(new RegExp(',\n' + indent + '    ', 'g'), ', ');
        grid = grid.replace(new RegExp('\n' + indent + '  (\\]|$)', 'g'), '$1');
        return '\n' + indent + '"grid": ' + grid + ']' + after + ']';
      }
    );
    return snapshot;
  }
});
