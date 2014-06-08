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
  getNewGameDefaults: function() {
    return {
      gamePlaying: true,
      gamePaused: false,
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
    },
    gamePanel: function() {
      return {
        component: 'GamePanel',
        gamePlaying: this.state.gamePlaying,
        gamePaused: this.state.gamePaused,
        nextTetrimino: this.state.nextTetrimino,
        onPressStart: this.start,
        onPressPause: this.pause,
        onPressResume: this.resume
      };
    }
  },
  start: function() {
    /**
     * Start or restart a Tetris session from scratch.
     */
    var newGameDefaults = this.getNewGameDefaults();
    this.setState(newGameDefaults);
    this.refs.well.reset();
    // setState is always synchronous so we can't read the next Tetrimino from
    // .state.nextTetrimino at this point
    this.insertNextTetriminoInWell(newGameDefaults.nextTetrimino);
    this.resume();
  },
  pause: function() {
    this.setState({gamePaused: true});
    this.refs.well.stopAnimationLoop();
  },
  resume: function() {
    this.setState({gamePaused: false});
    this.refs.well.startAnimationLoop();
  },
  render: function() {
    return (
      <div className="tetris">
        {this.loadChild('well')}
        {this.loadChild('gamePanel')}
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
    this.insertNextTetriminoInWell(this.state.nextTetrimino);
  },
  onFullWell: function() {
    this.setState({gamePlaying: false});
  },
  insertNextTetriminoInWell: function(nextTetrimino) {
    this.refs.well.loadTetrimino(nextTetrimino);
    this.setState({nextTetrimino: this.getRandomTetriminoType()});
  },
  getRandomTetriminoType: function() {
    return _.sample(_.keys(Tetris.SHAPES));
  }
});
