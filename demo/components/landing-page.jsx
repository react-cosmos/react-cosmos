/** @jsx React.DOM */

Cosmos.components.LandingPage = React.createClass({
  /**
   * Landing page for Cosmos framework with Flatris and data alongside.
   */
  mixins: [Cosmos.mixins.PersistState],
  getInitialState: function() {
    return {
      snapshot: ''
    };
  },
  children: {
    flatris: function() {
      return {
        component: 'Flatris'
      };
    }
  },
  render: function() {
    return (
      <div className="landing-page">
        <div className="content-wrapper">
          {this.loadChild('flatris')}
        </div>
        <pre className="data-snapshot">{this.state.snapshot}</pre>
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
    return nextState.snapshot != this.state.snapshot;
  },
  refreshSnapshot: function() {
    this.setState({
      snapshot: this.serializeState(this.refs.flatris.generateSnapshot(true))
    });
  },
  serializeState: function(snapshot) {
    var snapshot = JSON.stringify(snapshot, null, '  ');
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
