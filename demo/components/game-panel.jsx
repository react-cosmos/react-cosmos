/** @jsx React.DOM */

Cosmos.components.GamePanel = React.createClass({
  /**
   * The game panel contains
   * - the next Tetrimono to be inserted
   * - the score and lines cleared
   * - start or pause/resume controls
   */
  getDefaultProps: function() {
    return {
      playing: false,
      paused: false,
      score: 0,
      lines: 0,
      nextTetrimino: null
    };
  },
  render: function() {
    var classes = ['game-panel'];
    if (this.props.playing) {
      classes.push('playing');
    }
    return (
      <div className={classes.join(' ')}>
        <p className="title">Flatris</p>
        <p className="label">Score</p>
        <p className="count">{this.props.score}</p>
        <p className="label">Lines Cleared</p>
        <p className="count">{this.props.lines}</p>
        <p className="label">Next Shape</p>
        <div className={this.getNextTetriminoClass()}>
          {this.renderNextTetrimino()}
        </div>
        <div className="hint-arrow"></div>
        {this.renderGameButton()}
      </div>
    );
  },
  renderNextTetrimino: function() {
    var nextTetrimino = this.props.nextTetrimino;
    if (!nextTetrimino) {
      return;
    }
    return (
      <Cosmos component="Tetrimino"
              color={Flatris.COLORS[nextTetrimino]}
              state={{
                 grid: Flatris.SHAPES[nextTetrimino]
              }} />
    );
  },
  renderGameButton: function() {
    if (!this.props.playing) {
      return <button onClick={this.props.onPressStart}>New game</button>;
    }
    if (this.props.paused) {
      return <button onClick={this.props.onPressResume}>Resume</button>;
    } else {
      return <button onClick={this.props.onPressPause}>Pause</button>;
    }
  },
  getNextTetriminoClass: function() {
    var classes = ['next-tetrimino'];
    // We use this extra class to position tetriminos differently from CSS
    // based on their type
    if (this.props.nextTetrimino) {
      classes.push('next-tetrimino-' + this.props.nextTetrimino);
    }
    return classes.join(' ');
  }
});
