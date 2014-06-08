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
      gamePlaying: false,
      gamePaused: false,
      nextTetrimino: null
    };
  },
  render: function() {
    return (
      <div className="game-panel">
        <div className="next-tetrimino">
          {this.renderNextTetrimino()}
        </div>
        <div className="game-controls">
          {this.renderGameButton()}
        </div>
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
           color={Tetris.COLORS[nextTetrimino]}
           state={{
             grid: Tetris.SHAPES[nextTetrimino]
           }} />
    );
  },
  renderGameButton: function() {
    if (!this.props.gamePlaying) {
      return (
        <button onClick={this.props.onPressStart}>New game</button>
      );
    }
    if (this.props.gamePaused) {
      return (
        <button onClick={this.props.onPressResume}>Resume</button>
      );
    } else {
      return (
        <button onClick={this.props.onPressPause}>Pause</button>
      );
    }
  }
});
