const React = require('react');
const _ = require('lodash');
const AnimationLoopMixin = require('react-animation-loop');
const constants = require('../constants');
const grid = require('../lib/grid');
const WellGrid = require('./WellGrid');
const Tetrimino = require('./Tetrimino');

require('./Well.less');

// Keeping this a React class because we want to use the AnimationLoop mixin
// eslint-disable-next-line react/prefer-es6-class
module.exports = React.createClass({
  /**
   * A rectangular vertical shaft, where Tetriminos fall into during a Flatris
   * game. The Well has configurable size and speed. Tetrimino pieces can be
   * inserted inside the well and they will fall until they hit the bottom, and
   * eventually fill it. Whenever the pieces form a straight horizontal line it
   * will be cleared, emptying up space and allowing more pieces to enter
   * afterwards.
   */
  propTypes: {
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
    updateActiveTetriminoGrid: React.PropTypes.func.isRequired,
    updateActiveTetriminoPosition: React.PropTypes.func.isRequired,
    updateGrid: React.PropTypes.func.isRequired,
    onFullWell: React.PropTypes.func,
    onTetriminoLanding: React.PropTypes.func,
  },

  mixins: [AnimationLoopMixin],

  getInitialState() {
    return {
      animationLoopRunning: this.isGameRunning(this.props),
    };
  },

  componentWillReceiveProps(nextProps) {
    if (this.isGameRunning(nextProps) !== this.isGameRunning(this.props)) {
      this.setState({
        animationLoopRunning: this.isGameRunning(nextProps),
      });
    }
  },

  onFrame(frames) {
    if (!this.props.activeTetrimino) {
      return;
    }

    const tetriminoGrid = this.props.activeTetriminoGrid;
    const drop = {
      cells: this.activeTetrimino.getNumberOfCells(),
      hardDrop: this.props.dropAcceleration,
    };

    let tetriminoPosition = _.clone(this.props.activeTetriminoPosition);

    tetriminoPosition.y += this.getDropStepForFrames(frames);

    // The active Tetrimino keeps falling down until it hits something
    if (this.isPositionAvailableForTetriminoGrid(
      tetriminoGrid, tetriminoPosition
    )) {
      this.props.updateActiveTetriminoPosition(tetriminoPosition);
    } else {
      // A big frame skip could cause the Tetrimino to jump more than one row.
      // We need to ensure it ends up in the bottom-most one in case the jump
      // caused the Tetrimino to land
      tetriminoPosition =
        this.getBottomMostPositionForTetriminoGrid(tetriminoGrid,
                                                    tetriminoPosition);

      this.props.updateActiveTetriminoPosition(tetriminoPosition);

      // This is when the active Tetrimino hits the bottom of the Well and can
      // no longer be controlled
      drop.lines = this.transferActiveTetriminoBlocksToGrid(
          this.getGridPosition(this.props.activeTetriminoPosition));

      // Notify any listening parent when Well is full, it should stop
      // inserting any new Tetriminos from this point on (until the Well is
      // reset at least)
      if (tetriminoPosition.y < 0 &&
          typeof (this.props.onFullWell) === 'function') {
        this.props.onFullWell();
      }

      // Notify any listening parent about Tetrimino drops, with regard to the
      // one or more possible resulting line clears
      if (typeof (this.props.onTetriminoLanding) === 'function') {
        this.props.onTetriminoLanding(drop);
      }
    }
  },

  getTetriminoCSSSize() {
    return {
      width: `${(100 / this.props.cols) * 4}%`,
      height: `${(100 / this.props.rows) * 4}%`,
    };
  },

  getActiveTetriminoCSSPosition() {
    const position =
      this.getGridPosition(this.props.activeTetriminoPosition);

    return {
      top: `${(100 / this.props.rows) * position.y}%`,
      left: `${(100 / this.props.cols) * position.x}%`,
    };
  },

  getGridPosition(floatingPosition) {
    // The position has floating numbers because of how gravity is incremented
    // with each frame
    return {
      x: Math.floor(floatingPosition.x),
      y: Math.floor(floatingPosition.y),
    };
  },

  getDropStepForFrames(frames) {
    const dropFrames = this.props.dropAcceleration ?
        constants.DROP_FRAMES_ACCELERATED : this.props.dropFrames;
    return frames / dropFrames;
  },

  getBottomMostPositionForTetriminoGrid(tetriminoGrid, position) {
    const newPosition = Object.assign({}, position);

    // Snap vertical position to grid
    newPosition.y = Math.floor(newPosition.y);
    while (!this.isPositionAvailableForTetriminoGrid(
      tetriminoGrid, newPosition
    )) {
      newPosition.y -= 1;
    }

    return newPosition;
  },

  isGameRunning(props) {
    return props.playing && !props.paused;
  },

  rotateTetrimino() {
    if (this.props.activeTetrimino) {
      const tetriminoGrid = grid.rotate(this.props.activeTetriminoGrid);
      // If the rotation causes the active Tetrimino to go outside of the
      // Well bounds, its position will be adjusted to fit inside
      const tetriminoPosition = this.fitTetriminoGridPositionInWellBounds(
        tetriminoGrid, this.props.activeTetriminoPosition
      );

      // If the rotation causes a collision with landed Tetriminos than it won't
      // be applied
      if (this.isPositionAvailableForTetriminoGrid(
        tetriminoGrid, tetriminoPosition
      )) {
        this.props.updateActiveTetriminoGrid(tetriminoGrid);
      }
    }
  },

  moveTetriminoToLeft() {
    this.moveTetrimino(-1);
  },

  moveTetriminoToRight() {
    this.moveTetrimino(1);
  },

  moveTetrimino(offset) {
    if (!this.props.activeTetrimino) {
      return;
    }

    const tetriminoGrid = this.props.activeTetriminoGrid;
    const tetriminoPosition = _.clone(this.props.activeTetriminoPosition);
    tetriminoPosition.x += offset;

    // Attempting to move the Tetrimino outside the Well bounds or over landed
    // Tetriminos will be ignored
    if (this.isPositionAvailableForTetriminoGrid(
      tetriminoGrid, tetriminoPosition
    )) {
      this.props.updateActiveTetriminoPosition(tetriminoPosition);
    }
  },

  increaseSpeed() {
    this.setState({ dropFrames: this.props.dropFrames -
                               constants.DROP_FRAMES_DECREMENT });
  },

  transferActiveTetriminoBlocksToGrid(tetriminoPositionInGrid) {
    const rows = this.props.activeTetriminoGrid.length;
    const cols = this.props.activeTetriminoGrid[0].length;
    let blockCount = this.props.gridBlockCount;
    let newGrid = _.cloneDeep(this.props.grid);
    let relativeRow;
    let relativeCol;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // Ignore blank squares from the Tetrimino grid
        if (this.props.activeTetriminoGrid[row][col]) {
          relativeRow = tetriminoPositionInGrid.y + row;
          relativeCol = tetriminoPositionInGrid.x + col;

          // When the Well is full the Tetrimino will land before it enters the
          // top of the Well
          if (newGrid[relativeRow]) {
            newGrid[relativeRow][relativeCol] =
              ++blockCount + constants.COLORS[this.props.activeTetrimino];
          }
        }
      }
    }

    // Clear lines created after landing and transfering a Tetrimino
    const r = this.clearLinesFromGrid(newGrid);
    newGrid = r[0];
    const lines = r[1];

    this.props.updateGrid(newGrid, blockCount);

    // Return lines cleared to measure success of Tetrimino landing :)
    return lines;
  },

  clearLinesFromGrid(prevGrid) {
    /**
     * Clear all rows that form a complete line, from one left to right, inside
     * the Well grid. Gravity is applied to fill in the cleared lines with the
     * ones above, thus freeing up the Well for more Tetriminos to enter.
     */
    let linesCleared = 0;
    let isLine;
    let newGrid = _.cloneDeep(prevGrid);

    for (let row = this.props.rows - 1; row >= 0; row--) {
      isLine = true;

      for (let col = this.props.cols - 1; col >= 0; col--) {
        if (!newGrid[row][col]) {
          isLine = false;
        }
      }

      if (isLine) {
        newGrid = this.removeGridRow(newGrid, row);
        linesCleared++;

        // Go once more through the same row
        row++;
      }
    }

    return [newGrid, linesCleared];
  },

  removeGridRow(prevGrid, rowToRemove) {
    /**
     * Remove a row from the Well grid by descending all rows above, thus
     * overriding it with the previous row.
     */
    const newGrid = _.cloneDeep(prevGrid);

    for (let row = rowToRemove; row >= 0; row--) {
      for (let col = this.props.cols - 1; col >= 0; col--) {
        newGrid[row][col] = row ? newGrid[row - 1][col] : null;
      }
    }

    return newGrid;
  },

  isPositionAvailableForTetriminoGrid(tetriminoGrid, position) {
    const tetriminoPositionInGrid = this.getGridPosition(position);
    const tetriminoRows = tetriminoGrid.length;
    const tetriminoCols = tetriminoGrid[0].length;
    let relativeRow;
    let relativeCol;

    for (let row = 0; row < tetriminoRows; row++) {
      for (let col = 0; col < tetriminoCols; col++) {
        // Ignore blank squares from the Tetrimino grid
        if (tetriminoGrid[row][col]) {
          relativeRow = tetriminoPositionInGrid.y + row;
          relativeCol = tetriminoPositionInGrid.x + col;

          // Ensure Tetrimino block is within the horizontal bounds
          if (relativeCol < 0 || relativeCol >= this.props.cols) {
            return false;
          }

          // Tetriminos are accepted on top of the Well (it's how they enter)
          if (relativeRow >= 0) {
            // Check check if Tetrimino hit the bottom of the Well
            if (relativeRow >= this.props.rows) {
              return false;
            }

            // Then if the position is not already taken inside the grid
            if (this.props.grid[relativeRow][relativeCol]) {
              return false;
            }
          }
        }
      }
    }

    return true;
  },

  fitTetriminoGridPositionInWellBounds(tetriminoGrid, position) {
    const tetriminoRows = tetriminoGrid.length;
    const tetriminoCols = tetriminoGrid[0].length;
    const newPosition = Object.assign({}, position);

    for (let row = 0; row < tetriminoRows; row++) {
      for (let col = 0; col < tetriminoCols; col++) {
        // Ignore blank squares from the Tetrimino grid
        if (tetriminoGrid[row][col]) {
          const relativeCol = position.x + col;

          // Wall kick: A Tetrimino grid that steps outside of the Well grid will
          // be shifted slightly to slide back inside the Well grid
          if (relativeCol < 0) {
            newPosition.x -= relativeCol;
          } else if (relativeCol >= this.props.cols) {
            newPosition.x -= (relativeCol - this.props.cols) + 1;
          }
        }
      }
    }

    return newPosition;
  },

  render() {
    return (
      <div className="well">
        <div
          className="active-tetrimino"
          style={_.assign(this.getTetriminoCSSSize(),
                    this.getActiveTetriminoCSSPosition())}
        >
          {this.props.activeTetrimino ? (
            <Tetrimino
              ref={(instance) => { this.activeTetrimino = instance; }}
              color={constants.COLORS[this.props.activeTetrimino]}
              grid={this.props.activeTetriminoGrid}
            />
          ) : null}
        </div>
        <WellGrid
          grid={this.props.grid}
          gridBlockCount={this.props.gridBlockCount}
        />
      </div>
    );
  },
});
