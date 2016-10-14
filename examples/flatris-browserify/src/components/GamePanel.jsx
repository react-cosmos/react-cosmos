import React from 'react';
import { STOPPED, PLAYING, PAUSED } from '../constants/states';
import { SHAPES, COLORS } from '../constants/tetrimino';
import { attachPointerDownEvent } from '../lib/events';
import Tetrimino from './Tetrimino';

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
    const {
      gameState,
      onStart,
      onPause,
      onResume,
    } = this.props;

    let eventHandler;
    let label;

    switch (gameState) {
      case PLAYING:
        eventHandler = onPause;
        label = 'Pause';
        break;
      case PAUSED:
        eventHandler = onResume;
        label = 'Resume';
        break;
      default:
        eventHandler = onStart;
        label = 'New game';
    }

    return React.DOM.button(attachPointerDownEvent(eventHandler), label);
  }

  render() {
    const {
      score,
      lines,
      nextTetrimino,
    } = this.props;

    return (
      <div className="game-panel">
        <p className="title">Flatris</p>
        <p className="label">Score</p>
        <p className="count">{score}</p>
        <p className="label">Lines Cleared</p>
        <p className="count">{lines}</p>
        <p className="label">Next Shape</p>
        <div className={this.getNextTetriminoClass()}>
          {nextTetrimino ? (
            <Tetrimino
              key={nextTetrimino}
              color={COLORS[nextTetrimino]}
              grid={SHAPES[nextTetrimino]}
            />
          ) : null}
        </div>
        {this.renderGameButton()}
      </div>
    );
  }
}

GamePanel.propTypes = {
  gameState: React.PropTypes.oneOf([STOPPED, PLAYING, PAUSED]).isRequired,
  score: React.PropTypes.number.isRequired,
  lines: React.PropTypes.number.isRequired,
  nextTetrimino: React.PropTypes.string,
  onStart: React.PropTypes.func.isRequired,
  onPause: React.PropTypes.func.isRequired,
  onResume: React.PropTypes.func.isRequired,
};

module.exports = GamePanel;
