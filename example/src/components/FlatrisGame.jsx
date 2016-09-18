/* global window */

const React = require('react');
const _ = require('lodash');
const $ = require('jquery');
const constants = require('../constants');
const events = require('../lib/events');
const Well = require('./Well');
const GamePanel = require('./GamePanel');
const InfoPanel = require('./InfoPanel');

require('./FlatrisGame.less');

class FlatrisGame extends React.Component {
  /**
   * The Tetris game was originally designed and programmed by Alexey Pajitnov.
   * It was released on June 6, 1984 and has since become a world-wide
   * phenomenon. Read more about the game at http://en.wikipedia.org/wiki/Tetris
   */
  constructor() {
    super();

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onRotatePress = this.onRotatePress.bind(this);
    this.onLeftPress = this.onLeftPress.bind(this);
    this.onRightPress = this.onRightPress.bind(this);
    this.onPullPress = this.onPullPress.bind(this);
    this.onPullRelease = this.onPullRelease.bind(this);
    this.onTetriminoLanding = this.onTetriminoLanding.bind(this);
    this.onFullWell = this.onFullWell.bind(this);
    this.start = this.start.bind(this);
    this.pause = this.pause.bind(this);
    this.resume = this.resume.bind(this);

    this.state = _.assign(this.getNewGameDefaults(), {
      // Game is stopped by default and there's no Tetrimino to follow
      playing: false,
      nextTetrimino: null,
    });
  }

  componentDidMount() {
    $(window).on('keydown', this.onKeyDown);
    $(window).on('keyup', this.onKeyUp);
  }

  componentWillUnmount() {
    $(window).off('keydown', this.onKeyDown);
    $(window).off('keyup', this.onKeyUp);
  }

  onKeyDown(e) {
    // Prevent page from scrolling when pressing arrow keys
    if (_.values(constants.KEYS).indexOf(e.keyCode) !== -1) {
      e.preventDefault();
    }
    // Ignore user events when game is stopped or paused
    if (!this.state.playing || this.state.paused) {
      return;
    }

    switch (e.keyCode) {
      case constants.KEYS.DOWN:
        this.well.setState({ dropAcceleration: true });
        break;
      case constants.KEYS.UP:
        this.well.rotateTetrimino();
        break;
      case constants.KEYS.LEFT:
        this.well.moveTetriminoToLeft();
        break;
      case constants.KEYS.RIGHT:
        this.well.moveTetriminoToRight();
        break;
      default:
    }
  }

  onKeyUp(e) {
    // Ignore user events when game is stopped or paused
    if (!this.state.playing || this.state.paused) {
      return;
    }

    if (e.keyCode === constants.KEYS.DOWN) {
      this.well.setState({ dropAcceleration: false });
    }
  }

  onRotatePress(e) {
    // Ignore user events when game is stopped or paused
    if (!this.state.playing || this.state.paused) {
      return;
    }

    e.preventDefault();
    this.well.rotateTetrimino();
  }

  onLeftPress(e) {
    // Ignore user events when game is stopped or paused
    if (!this.state.playing || this.state.paused) {
      return;
    }

    e.preventDefault();
    this.well.moveTetriminoToLeft();
  }

  onRightPress(e) {
    // Ignore user events when game is stopped or paused
    if (!this.state.playing || this.state.paused) {
      return;
    }

    e.preventDefault();
    this.well.moveTetriminoToRight();
  }

  onPullPress(e) {
    // Ignore user events when game is stopped or paused
    if (!this.state.playing || this.state.paused) {
      return;
    }

    e.preventDefault();
    this.well.setState({ dropAcceleration: true });
  }

  onPullRelease(e) {
    // Ignore user events when game is stopped or paused
    if (!this.state.playing || this.state.paused) {
      return;
    }

    e.preventDefault();
    this.well.setState({ dropAcceleration: false });
  }

  onTetriminoLanding(drop) {
    // Stop inserting Tetriminos and awarding bonuses after game is over
    if (!this.state.playing) {
      return;
    }

    let score = this.state.score;
    let lines = this.state.lines;
    const level = lines + 1;

    // Rudimentary scoring logic, no T-Spin and combo bonuses. Read more at
    // http://tetris.wikia.com/wiki/Scoring
    score += drop.hardDrop ? drop.cells * 2 : drop.cells;
    if (drop.lines) {
      score += constants.LINE_CLEAR_BONUSES[drop.lines - 1] * level;
      lines += drop.lines;

      // Increase speed whenever a line is cleared (fast game)
      this.well.increaseSpeed();
    }

    this.setState({
      score,
      lines,
    });
    this.insertNextTetriminoInWell(this.state.nextTetrimino);
  }

  onFullWell() {
    this.pause();
    this.setState({
      playing: false,
      // There won't be any next Tetrimino when the game is over
      nextTetrimino: null,
    });
  }

  getNewGameDefaults() {
    return {
      playing: true,
      paused: true,
      score: 0,
      lines: 0,
      nextTetrimino: this.getRandomTetriminoType(),
    };
  }

  getRandomTetriminoType() {
    return _.sample(_.keys(constants.SHAPES));
  }

  insertNextTetriminoInWell(nextTetrimino) {
    this.well.loadTetrimino(nextTetrimino);
    this.setState({ nextTetrimino: this.getRandomTetriminoType() });
  }

  start() {
    /**
    * Start or restart a Flatris session from scratch.
    */
    const newGameDefaults = this.getNewGameDefaults();
    this.setState(newGameDefaults);
    this.well.reset();

    // setState is always synchronous so we can't read the next Tetrimino from
    // .state.nextTetrimino at this point
    this.insertNextTetriminoInWell(newGameDefaults.nextTetrimino);

    this.resume();
  }

  pause() {
    this.setState({ paused: true });
    // Stop any on-going acceleration inside the Well
    this.well.setState({
      animationLoopRunning: false,
      dropAcceleration: false,
    });
  }

  resume() {
    this.setState({ paused: false });
    this.well.setState({ animationLoopRunning: true });
  }

  renderInfoPanel() {
    return !this.state.playing || this.state.paused ? <InfoPanel /> : null;
  }

  renderControls() {
    return (<div className="controls">
      {React.DOM.button(
        events.attachPointerDownEvent(this.onRotatePress), '↻')}
      {React.DOM.button(
        events.attachPointerDownEvent(this.onLeftPress), '←')}
      {React.DOM.button(
        events.attachPointerDownEvent(this.onRightPress), '→')}
      {React.DOM.button(
        _.assign(
          events.attachPointerDownEvent(this.onPullPress),
          events.attachPointerUpEvent(this.onPullRelease)), '↓')}
    </div>);
  }

  render() {
    return (<div className="flatris-game">
      <Well
        ref={(instance) => { this.well = instance; }}
        rows={constants.WELL_ROWS}
        cols={constants.WELL_COLS}
        onTetriminoLanding={this.onTetriminoLanding}
        onFullWell={this.onFullWell}
      />
      {this.renderInfoPanel()}
      <GamePanel
        playing={this.state.playing}
        paused={this.state.paused}
        score={this.state.score}
        lines={this.state.lines}
        nextTetrimino={this.state.nextTetrimino}
        onPressStart={this.start}
        onPressPause={this.pause}
        onPressResume={this.resume}
      />
      {this.renderControls()}
    </div>);
  }
}

module.exports = FlatrisGame;
