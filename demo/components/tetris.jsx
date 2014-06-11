/** @jsx React.DOM */

Cosmos.components.Tetris = React.createClass({
  /**
   * The Tetris game was originally designed and programmed by Alexey Pajitnov.
   * It was released on June 6, 1984 and has since become a world-wide
   * phenomenon. Read more about the game at http://en.wikipedia.org/wiki/Tetris
   */
  getInitialState: function() {
    return _.extend(this.getNewGameDefaults(), {
      // Game is stopped by default and there's no Tetrimino to follow
      playing: false,
      nextTetrimino: null
    });
  },
  getNewGameDefaults: function() {
    return {
      playing: true,
      paused: false,
      score: 0,
      lines: 0,
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
    var newGameDefaults = this.getNewGameDefaults();
    this.setState(newGameDefaults);
    this.refs.well.reset();
    // setState is always synchronous so we can't read the next Tetrimino from
    // .state.nextTetrimino at this point
    this.insertNextTetriminoInWell(newGameDefaults.nextTetrimino);
    this.resume();
  },
  pause: function() {
    this.setState({paused: true});
    this.refs.well.stopAnimationLoop();
  },
  resume: function() {
    this.setState({paused: false});
    this.refs.well.startAnimationLoop();
  },
  render: function() {
    return (
      <div className="tetris">
        {this.loadChild('well')}
        {Cosmos(this.getGamePanelProps())}
      </div>
    );
  },
  getGamePanelProps: function() {
    return {
      component: 'GamePanel',
      playing: this.state.playing,
      paused: this.state.paused,
      score: this.state.score,
      lines: this.state.lines,
      nextTetrimino: this.state.nextTetrimino,
      onPressStart: this.start,
      onPressPause: this.pause,
      onPressResume: this.resume
    };
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
    // Ignore key events when game is stopped or paused
    if (!this.state.playing || this.state.paused) {
      return;
    }
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
    // Ignore key events when game is stopped or paused
    if (!this.state.playing || this.state.paused) {
      return;
    }
    if (e.keyCode == Tetris.KEYS.DOWN) {
      this.refs.well.setState({dropAcceleration: false});
    }
  },
  onTetriminoLanding: function(drop) {
    // Stop inserting Tetriminos and awarding bonuses after game is over
    if (!this.state.playing) {
      return;
    }
    var score = this.state.score,
        lines = this.state.lines,
        level = Math.floor(lines / 10) + 1;

    // Rudimentary scoring logic, no T-Spin and combo bonuses. Read more at
    // http://tetris.wikia.com/wiki/Scoring
    score += drop.hardDrop ? drop.cells * 2 : drop.cells;
    if (drop.lines) {
      score += Tetris.LINE_CLEAR_BONUSES[drop.lines - 1] * level;
      lines += drop.lines;
    }

    // Increase speed with every ten lines cleared (aka level)
    if (Math.floor(lines / 10) + 1 > level &&
        this.refs.well.state.dropFrames > Tetris.DROP_FRAMES_ACCELERATED) {
      this.refs.well.increaseSpeed();
    }

    this.setState({
      score: score,
      lines: lines
    });
    this.insertNextTetriminoInWell(this.state.nextTetrimino);
  },
  onFullWell: function() {
    this.setState({playing: false});
  },
  insertNextTetriminoInWell: function(nextTetrimino) {
    this.refs.well.loadTetrimino(nextTetrimino);
    this.setState({nextTetrimino: this.getRandomTetriminoType()});
  },
  getRandomTetriminoType: function() {
    return _.sample(_.keys(Tetris.SHAPES));
  }
});
