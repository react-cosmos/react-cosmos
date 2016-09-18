const React = require('react');
const constants = require('../constants');
const events = require('../lib/events');
const Tetrimino = require('./Tetrimino');

require('./GamePanel.less');

class GamePanel extends React.Component {
  /**
   * The game panel contains:
   * - The next Tetrimino to be inserted
   * - The score and lines cleared
   * - Start or pause/resume controls
   */
  getNextTetriminoClass() {
    const classes = ['next-tetrimino'];
    // We use this extra class to position tetriminos differently from CSS
    // based on their type
    if (this.props.nextTetrimino) {
      classes.push(`next-tetrimino-${this.props.nextTetrimino}`);
    }
    return classes.join(' ');
  }

  renderGameButton() {
    let eventHandler;
    let label;

    if (!this.props.playing) {
      eventHandler = this.props.onPressStart;
      label = 'New game';
    } else if (this.props.paused) {
      eventHandler = this.props.onPressResume;
      label = 'Resume';
    } else {
      eventHandler = this.props.onPressPause;
      label = 'Pause';
    }

    return React.DOM.button(events.attachPointerDownEvent(eventHandler), label);
  }

  render() {
    const nextTetrimino = this.props.nextTetrimino;

    return (<div className="game-panel">
      <p className="title">Flatris</p>
      <p className="label">Score</p>
      <p className="count">{this.props.score}</p>
      <p className="label">Lines Cleared</p>
      <p className="count">{this.props.lines}</p>
      <p className="label">Next Shape</p>
      <div className={this.getNextTetriminoClass()}>
        {nextTetrimino ? (
          <Tetrimino
            key={nextTetrimino}
            color={constants.COLORS[nextTetrimino]}
            grid={constants.SHAPES[nextTetrimino]}
          />
        ) : null}
      </div>
      {this.renderGameButton()}
    </div>);
  }
}

GamePanel.propTypes = {
  playing: React.PropTypes.bool,
  paused: React.PropTypes.bool,
  score: React.PropTypes.number,
  lines: React.PropTypes.number,
  nextTetrimino: React.PropTypes.string,
  onPressStart: React.PropTypes.func,
  onPressPause: React.PropTypes.func,
  onPressResume: React.PropTypes.func,
};

GamePanel.defaultProps = {
  playing: false,
  paused: false,
  score: 0,
  lines: 0,
  nextTetrimino: null,
};

module.exports = GamePanel;
