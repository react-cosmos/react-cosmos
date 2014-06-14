/** @jsx React.DOM */

Cosmos.components.LandingPage = React.createClass({
  /**
   * Landing page for Cosmos framework with Flatris and data alongside.
   */
  mixins: [Cosmos.mixins.PersistState],
  getInitialState: function() {
    return {
      revealedInfo: false,
      snapshot: ''
    };
  },
  children: {
    flatris: function() {
      return {
        component: 'Flatris',
        onTetriminoLanding: this.onTetriminoLanding
      };
    }
  },
  render: function() {
    return (
      <div className="landing-page">
        <div className="content-wrapper">
          {this.loadChild('flatris')}
          {this.getIntroText()}
        </div>
        <pre className="data-snapshot">{this.state.snapshot}</pre>
      </div>
    );
  },
  getIntroText: function() {
    if (!this.state.revealedInfo &&
        // XXX Reveal framework info directly for mobile users as Flatris
        // doesn't yet support browser events
        !Flatris.isMobileUser()) {
      return;
    }
    return (
      <div className="introduction">
        <p className="title">Meet <strong>Cosmos</strong>,</p>
        <p className="description">a JavaScript user interface framework that cares about <strong>data clarity and component autonomy.</strong></p>
        <p>Built on top of Facebook's React, Cosmos glues components together and provides a uniform structure between them.</p>
        <p>Explore project on <a href="https://github.com/skidding/cosmos">GitHub.</a></p>
        {Flatris.isMobileUser() ? this.getMobileDisclaimer() : ''}
      </div>
    );
  },
  getMobileDisclaimer: function() {
    // TODO Remove this once Flatris supports keyboard events
    return <p><em>Flatris only works with keyboard events for now. Sorry.</em></p>;
  },
  componentDidMount: function() {
    this.refreshSnapshot();
    this._intervalId = setInterval(this.refreshSnapshot, 500);
  },
  componentWillUnmount: function() {
    clearInterval(this._intervalId);
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    // No need to render for an identical snapshot
    return _.without(_.keys(nextState), 'snapshot').length ||
           nextState.snapshot != this.state.snapshot;
  },
  componentDidUpdate: function(prevProps, prevState) {
    // Pause game and scroll down to the framework info once revealed
    if (this.state.revealedInfo && !prevState.revealedInfo) {
      this.refs.flatris.pause();
      this.revealCosmosInfo();
    }
  },
  onTetriminoLanding: function(drop) {
    // Reveal info about Cosmos the first time a line is cleared
    if (drop.lines) {
      this.setState({revealedInfo: true});
      // Refresh snapshot synchronously for better UI feedback
      this.refreshSnapshot();
    }
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
  },
  revealCosmosInfo: function() {
    // Transition Cosmos text when showing it for the first time
    var $introduction = $(this.getDOMNode()).find('.introduction');
    $('html,body').animate({
      scrollTop: $introduction.offset().top
    }, 1000, 'linear');
    $introduction.css({opacity: 0}).animate({
      opacity: 1
    }, 1000, 'linear');
  }
});
