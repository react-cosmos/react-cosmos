/** @jsx React.DOM */

Cosmos.components.Tetris = React.createClass({
  /**
   * The Tetris game was originally designed and programmed by Alexey Pajitnov.
   * It was released on June 6, 1984 and has since become a world-wide
   * phenomenon. Read more about the game at http://en.wikipedia.org/wiki/Tetris
   */
  getInitialState: function() {
    return {
      gamePlaying: false
    };
  },
  getGameDefaults: function() {
    return {
      gamePlaying: true,
      nextTetrimino: this.getRandomTetriminoType()
    };
  },
  mixins: [Cosmos.mixins.PersistState],
  children: {
    well: function() {
      return {
        component: 'Well',
        onTetriminoLanding: this.onTetriminoLanding,
        onFullWell: this.onFullWell
      };
    }
  },
  start: function() {
    /**
     * Start or restart a Tetris session from scratch.
     */
    this.setState(this.getGameDefaults());
    this.refs.well.reset();
    this.insertNextTetriminoInWell();
    this.resume();
  },
  pause: function() {
    this.refs.well.stopAnimationLoop();
  },
  resume: function() {
    this.refs.well.startAnimationLoop();
  },
  render: function() {
    return (
      <div className="tetris">
        {this.loadChild('well')}
      </div>
    );
  },
  componentDidMount: function() {
    $(window).on('keydown', this.onKeyDown);
    $(window).on('keyup', this.onKeyUp);
  },
  componentWillUnmount: function() {
    $(window).off('keydown', this.onKeyDown);
    $(window).off('keyup', this.onKeyUp);
  },
  onKeyDown: function(e) {
    switch (e.keyCode) {
    case Tetris.KEYS.DOWN:
      this.refs.well.setState({dropAcceleration: true});
      break;
    case Tetris.KEYS.UP:
      this.refs.well.rotateTetrimino();
      break;
    case Tetris.KEYS.LEFT:
      this.refs.well.moveTetriminoToLeft();
      break;
    case Tetris.KEYS.RIGHT:
      this.refs.well.moveTetriminoToRight();
    }
  },
  onKeyUp: function(e) {
    if (e.keyCode == Tetris.KEYS.DOWN) {
      this.refs.well.setState({dropAcceleration: false});
    }
  },
  onTetriminoLanding: function(linesCleared) {
    // Stop inserting Tetriminos and awarding bonuses after game is over
    if (!this.state.gamePlaying) {
      return;
    }
    this.insertNextTetriminoInWell();
  },
  onFullWell: function() {
    this.setState({gamePlaying: false});
  },
  insertNextTetriminoInWell: function() {
    this.refs.well.loadTetrimino(this.state.nextTetrimino);
    this.setState({nextTetrimino: this.getRandomTetriminoType()});
  },
  getRandomTetriminoType: function() {
    return _.sample(_.keys(Tetris.SHAPES));
  }
});
