/* global window */

const React = require('react');
const connect = require('react-redux').connect;
const _ = require('lodash');
const $ = require('jquery');
const constants = require('../constants');
const events = require('../lib/events');
const gridLib = require('../lib/grid');
const Well = require('./Well');
const GamePanel = require('./GamePanel');
const InfoPanel = require('./InfoPanel');

require('./FlatrisGame.less');

const getRandomTetriminoType = () => _.sample(_.keys(constants.SHAPES));

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

    if (!this.isGameRunning()) {
      return;
    }

    switch (e.keyCode) {
      case constants.KEYS.DOWN:
        this.props.enableDropAcceleration();
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
    if (!this.isGameRunning()) {
      return;
    }

    if (e.keyCode === constants.KEYS.DOWN) {
      this.props.disableDropAcceleration();
    }
  }

  onRotatePress(e) {
    if (!this.isGameRunning()) {
      return;
    }

    e.preventDefault();
    this.well.rotateTetrimino();
  }

  onLeftPress(e) {
    if (!this.isGameRunning()) {
      return;
    }

    e.preventDefault();
    this.well.moveTetriminoToLeft();
  }

  onRightPress(e) {
    if (!this.isGameRunning()) {
      return;
    }

    e.preventDefault();
    this.well.moveTetriminoToRight();
  }

  onPullPress(e) {
    if (!this.isGameRunning()) {
      return;
    }

    e.preventDefault();
    this.props.enableDropAcceleration();
  }

  onPullRelease(e) {
    if (!this.isGameRunning()) {
      return;
    }

    e.preventDefault();
    this.props.disableDropAcceleration();
  }

  onTetriminoLanding(drop) {
    const {
      playing,
      score,
      lines,
      nextTetrimino,
    } = this.props;

    // Stop inserting Tetriminos and awarding bonuses after game is over
    if (!playing) {
      return;
    }

    let nextScore = score;
    let nextLines = lines;
    const level = nextLines + 1;

    // Rudimentary scoring logic, no T-Spin and combo bonuses. Read more at
    // http://tetris.wikia.com/wiki/Scoring
    nextScore += drop.hardDrop ? drop.cells * 2 : drop.cells;
    if (drop.lines) {
      nextScore += constants.LINE_CLEAR_BONUSES[drop.lines - 1] * level;
      nextLines += drop.lines;

      // Increase speed whenever a line is cleared (fast game)
      this.well.increaseSpeed();
    }

    this.props.updateScore(nextScore, nextLines);

    this.insertNextTetriminoInWell(nextTetrimino);
  }

  getInitialPositionForTetriminoType(type) {
    /**
     * Generates positions a Tetrimino entering the Well. The I Tetrimino
     * occupies columns 4, 5, 6 and 7, the O Tetrimino occupies columns 5 and
     * 6, and the remaining 5 Tetriminos occupy columns 4, 5 and 6. Pieces
     * spawn above the visible playfield (that's why y is -2)
     */
    if (!type) {
      return { x: 0, y: 0 };
    }

    const tetriminoGrid = constants.SHAPES[type];
    return {
      x: Math.round(this.props.cols / 2) - Math.round(tetriminoGrid[0].length / 2),
      y: -2,
    };
  }

  isGameRunning() {
    return this.props.playing && !this.props.paused;
  }

  insertNextTetriminoInWell(nextTetrimino) {
    this.props.loadTetrimino(
      nextTetrimino,
      constants.SHAPES[nextTetrimino],
      // Reset position to place new Tetrimino at the top entrance point
      this.getInitialPositionForTetriminoType(nextTetrimino)
    );
    this.props.setNextTetrimino(getRandomTetriminoType());
  }

  renderInfoPanel() {
    const {
      playing,
      paused,
    } = this.props;

    return !playing || paused ? <InfoPanel /> : null;
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
    const {
      cols,
      rows,
      grid,
      gridBlockCount,
      playing,
      paused,
      score,
      lines,
      nextTetrimino,
      activeTetrimino,
      activeTetriminoGrid,
      activeTetriminoPosition,
      dropFrames,
      dropAcceleration,
    } = this.props;

    return (<div className="flatris-game">
      <Well
        ref={(instance) => { this.well = instance; }}
        cols={cols}
        rows={rows}
        grid={grid}
        gridBlockCount={gridBlockCount}
        playing={playing}
        paused={paused}
        activeTetrimino={activeTetrimino}
        activeTetriminoGrid={activeTetriminoGrid}
        activeTetriminoPosition={activeTetriminoPosition}
        dropFrames={dropFrames}
        dropAcceleration={dropAcceleration}
        onTetriminoLanding={this.onTetriminoLanding}
        onFullWell={this.props.endGame}
        updateGrid={this.props.updateGrid}
        updateActiveTetriminoGrid={this.props.updateActiveTetriminoGrid}
        updateActiveTetriminoPosition={this.props.updateActiveTetriminoPosition}
      />
      {this.renderInfoPanel()}
      <GamePanel
        playing={playing}
        paused={paused}
        score={score}
        lines={lines}
        nextTetrimino={nextTetrimino}
        onPressStart={() => {
          this.props.start();
          this.insertNextTetriminoInWell(getRandomTetriminoType());
        }}
        onPressPause={this.props.pause}
        onPressResume={this.props.resume}
      />
      {this.renderControls()}
    </div>);
  }
}

FlatrisGame.propTypes = {
  cols: React.PropTypes.number.isRequired,
  rows: React.PropTypes.number.isRequired,
  grid: React.PropTypes.arrayOf(
    React.PropTypes.arrayOf(React.PropTypes.string)
  ).isRequired,
  gridBlockCount: React.PropTypes.number.isRequired,
  playing: React.PropTypes.bool.isRequired,
  paused: React.PropTypes.bool.isRequired,
  score: React.PropTypes.number.isRequired,
  lines: React.PropTypes.number.isRequired,
  nextTetrimino: React.PropTypes.string,
  activeTetrimino: React.PropTypes.string,
  activeTetriminoGrid: React.PropTypes.arrayOf(
    React.PropTypes.arrayOf(React.PropTypes.number)
  ),
  activeTetriminoPosition: React.PropTypes.shape({
    x: React.PropTypes.number,
    y: React.PropTypes.number,
  }),
  dropFrames: React.PropTypes.number.isRequired,
  dropAcceleration: React.PropTypes.bool.isRequired,
  start: React.PropTypes.func.isRequired,
  endGame: React.PropTypes.func.isRequired,
  pause: React.PropTypes.func.isRequired,
  resume: React.PropTypes.func.isRequired,
  loadTetrimino: React.PropTypes.func.isRequired,
  setNextTetrimino: React.PropTypes.func.isRequired,
  updateActiveTetriminoGrid: React.PropTypes.func.isRequired,
  updateActiveTetriminoPosition: React.PropTypes.func.isRequired,
  updateGrid: React.PropTypes.func.isRequired,
  updateScore: React.PropTypes.func.isRequired,
  enableDropAcceleration: React.PropTypes.func.isRequired,
  disableDropAcceleration: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => state;
const mapDispatchToProps = (dispatch) => ({
  start: () => dispatch({
    type: 'START',
    payload: Object.assign({}, {
      grid: gridLib.generateEmptyMatrix(constants.WELL_ROWS, constants.WELL_COLS),
      gridBlockCount: 0,
      playing: true,
      paused: false,
      score: 0,
      lines: 0,
      nextTetrimino: getRandomTetriminoType(),
      activeTetrimino: null,
      activeTetriminoGrid: [],
      activeTetriminoPosition: { x: 0 },
      dropFrames: constants.DROP_FRAMES_DEFAULT,
      dropAcceleration: false,
    }),
  }),
  endGame: () => dispatch({
    type: 'END_GAME',
    payload: {
      playing: false,
      // There won't be any next Tetrimino when the game is over
      nextTetrimino: null,
    },
  }),
  pause: () => dispatch({
    type: 'PAUSE',
    payload: {
      paused: true,
      dropAcceleration: false,
    },
  }),
  resume: () => dispatch({
    type: 'RESUME',
    payload: { paused: false },
  }),
  loadTetrimino: (activeTetrimino, activeTetriminoGrid, activeTetriminoPosition) => dispatch({
    type: 'LOAD_TETRIMINO',
    payload: { activeTetrimino, activeTetriminoGrid, activeTetriminoPosition },
  }),
  setNextTetrimino: (nextTetrimino) => dispatch({
    type: 'SET_NEXT_TETRIMINO',
    payload: { nextTetrimino },
  }),
  updateActiveTetriminoGrid: (activeTetriminoGrid) => dispatch({
    type: 'UPDATE_ACTIVE_TETRIMINO_GRID',
    payload: { activeTetriminoGrid },
  }),
  updateActiveTetriminoPosition: (activeTetriminoPosition) => dispatch({
    type: 'UPDATE_ACTIVE_TETRIMINO_POSITION',
    payload: { activeTetriminoPosition },
  }),
  updateGrid: (grid, gridBlockCount) => dispatch({
    type: 'UPDATE_GRID',
    payload: { grid, gridBlockCount },
  }),
  updateScore: (score, lines) => dispatch({
    type: 'UPDATE_SCORE',
    payload: { score, lines },
  }),
  enableDropAcceleration: () => dispatch({
    type: 'ENABLE_DROP_ACCELARATION',
    payload: { dropAcceleration: true },
  }),
  disableDropAcceleration: () => dispatch({
    type: 'DISABLE_DROP_ACCELARATION',
    payload: { dropAcceleration: false },
  }),
});

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(FlatrisGame);
