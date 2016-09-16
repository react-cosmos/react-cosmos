var React = require('react'),
    _ = require('lodash'),
    AnimationLoopMixin = require('react-animation-loop'),
    constants = require('../constants.js'),
    grid = require('../lib/grid.js'),
    WellGrid = require('./WellGrid.jsx'),
    Tetrimino = require('./Tetrimino.jsx');

require('./Well.less');

// Keeping this a React class because we want to use the AnimationLoop mixin
module.exports = React.createClass({
  /**
   * A rectangular vertical shaft, where Tetriminos fall into during a Flatris
   * game. The Well has configurable size and speed. Tetrimino pieces can be
   * inserted inside the well and they will fall until they hit the bottom, and
   * eventually fill it. Whenever the pieces form a straight horizontal line it
   * will be cleared, emptying up space and allowing more pieces to enter
   * afterwards.
   */
  mixins: [AnimationLoopMixin],

  getInitialState: function() {
    return {
      grid: grid.generateEmptyMatrix(this.props.rows, this.props.cols),
      // Grid blocks need unique IDs to be used as React keys in order to tie
      // them to DOM nodes and prevent reusing them between rows when clearing
      // lines. DOM nodes need to stay the same to animate them when "falling"
      gridBlockCount: 0,
      activeTetrimino: null,
      activeTetriminoGrid: null,
      // The active Tetrimino position will be reset whenever a new Tetrimino
      // is inserted in the Well, using the _getInitialPositionForTetriminoType
      // method
      activeTetriminoPosition: {x: 0, y: 0},
      dropFrames: constants.DROP_FRAMES_DEFAULT,
      dropAcceleration: false,
      animationLoopRunning: true
    };
  },

  render: function() {
    return (
      <div className="well">
        <div className="active-tetrimino"
             style={_.assign(this._getTetriminoCSSSize(),
                    this._getActiveTetriminoCSSPosition())}>
          {this.state.activeTetrimino ? (
            <Tetrimino
              ref="activeTetrimino"
              color={constants.COLORS[this.state.activeTetrimino]}
              grid={this.state.activeTetriminoGrid}
            />
          ) : null}
        </div>
        <WellGrid
          ref="wellGrid"
          grid={this.state.grid}
          gridBlockCount={this.state.gridBlockCount}
        />
      </div>
    );
  },

  reset: function() {
    this.setState({
      grid: grid.generateEmptyMatrix(this.props.rows, this.props.cols),
      gridBlockCount: 0,
      dropFrames: constants.DROP_FRAMES_DEFAULT
    });

    this.loadTetrimino(null);
  },

  loadTetrimino: function(type) {
    this.setState({
      activeTetrimino: type,
      activeTetriminoGrid: constants.SHAPES[type],
      // Reset position to place new Tetrimino at the top entrance point
      activeTetriminoPosition: this._getInitialPositionForTetriminoType(type)
    });
  },

  rotateTetrimino: function() {
    if (this.state.activeTetrimino) {
      var tetriminoGrid = grid.rotate(this.state.activeTetriminoGrid),
          // If the rotation causes the active Tetrimino to go outside of the
          // Well bounds, its position will be adjusted to fit inside
          tetriminoPosition = this._fitTetriminoGridPositionInWellBounds(
              tetriminoGrid, this.state.activeTetriminoPosition);

      // If the rotation causes a collision with landed Tetriminos than it won't
      // be applied
      if (this._isPositionAvailableForTetriminoGrid(tetriminoGrid,
                                                    tetriminoPosition)) {
        this.setState({activeTetriminoGrid: tetriminoGrid});
      }
    }
  },

  moveTetriminoToLeft: function() {
    this.moveTetrimino(-1);
  },

  moveTetriminoToRight: function() {
    this.moveTetrimino(1);
  },

  moveTetrimino: function(offset) {
    if (!this.state.activeTetrimino) {
      return;
    }

    var tetriminoGrid = this.state.activeTetriminoGrid,
        tetriminoPosition = _.clone(this.state.activeTetriminoPosition);
    tetriminoPosition.x += offset;

    // Attempting to move the Tetrimino outside the Well bounds or over landed
    // Tetriminos will be ignored
    if (this._isPositionAvailableForTetriminoGrid(tetriminoGrid,
                                                  tetriminoPosition)) {
      this.setState({activeTetriminoPosition: tetriminoPosition});
    }
  },

  increaseSpeed: function() {
    this.setState({dropFrames: this.state.dropFrames -
                               constants.DROP_FRAMES_DECREMENT});
  },

  onFrame: function(frames) {
    if (!this.state.activeTetrimino) {
      return;
    }

    var tetriminoGrid = this.state.activeTetriminoGrid,
        tetriminoPosition = _.clone(this.state.activeTetriminoPosition),
        drop = {
          cells: this.refs.activeTetrimino.getNumberOfCells(),
          hardDrop: this.state.dropAcceleration
        };

    tetriminoPosition.y += this._getDropStepForFrames(frames);

    // The active Tetrimino keeps falling down until it hits something
    if (this._isPositionAvailableForTetriminoGrid(tetriminoGrid,
                                                  tetriminoPosition)) {
      this.setState({activeTetriminoPosition: tetriminoPosition});
    } else {
      // A big frame skip could cause the Tetrimino to jump more than one row.
      // We need to ensure it ends up in the bottom-most one in case the jump
      // caused the Tetrimino to land
      tetriminoPosition =
        this._getBottomMostPositionForTetriminoGrid(tetriminoGrid,
                                                    tetriminoPosition);

      this.setState({activeTetriminoPosition: tetriminoPosition});

      // This is when the active Tetrimino hits the bottom of the Well and can
      // no longer be controlled
      drop.lines = this._transferActiveTetriminoBlocksToGrid(
          this._getGridPosition(this.state.activeTetriminoPosition));

      // Unload Tetrimino after landing it
      this.loadTetrimino(null);

      // Notify any listening parent when Well is full, it should stop
      // inserting any new Tetriminos from this point on (until the Well is
      // reset at least)
      if (tetriminoPosition.y < 0 &&
          typeof(this.props.onFullWell) == 'function') {
        this.props.onFullWell();
      }

      // Notify any listening parent about Tetrimino drops, with regard to the
      // one or more possible resulting line clears
      if (typeof(this.props.onTetriminoLanding) == 'function') {
        this.props.onTetriminoLanding(drop);
      }
    }
  },

  _transferActiveTetriminoBlocksToGrid: function(tetriminoPositionInGrid) {
    var rows = rows = this.state.activeTetriminoGrid.length,
               cols = this.state.activeTetriminoGrid[0].length,
               blockCount = this.state.gridBlockCount,
               row,
               col,
               relativeRow,
               relativeCol,
               lines;

    for (row = 0; row < rows; row++) {
      for (col = 0; col < cols; col++) {
        // Ignore blank squares from the Tetrimino grid
        if (!this.state.activeTetriminoGrid[row][col]) {
          continue;
        }

        relativeRow = tetriminoPositionInGrid.y + row;
        relativeCol = tetriminoPositionInGrid.x + col;

        // When the Well is full the Tetrimino will land before it enters the
        // top of the Well
        if (this.state.grid[relativeRow]) {
          this.state.grid[relativeRow][relativeCol] =
            ++blockCount + constants.COLORS[this.state.activeTetrimino];
        }
      }
    }

    // Clear lines created after landing and transfering a Tetrimino
    lines = this._clearLinesFromGrid();

    // Push grid updates reactively and update DOM since we know for sure the
    // grid changed here
    this.setState({
      grid: this.state.grid,
      gridBlockCount: blockCount
    });

    // Return lines cleared to measure success of Tetrimino landing :)
    return lines;
  },

  _clearLinesFromGrid: function() {
    /**
     * Clear all rows that form a complete line, from one left to right, inside
     * the Well grid. Gravity is applied to fill in the cleared lines with the
     * ones above, thus freeing up the Well for more Tetriminos to enter.
     */
    var linesCleared = 0,
        isLine,
        row,
        col;

    for (row = this.props.rows - 1; row >= 0; row--) {
      isLine = true;

      for (col = this.props.cols - 1; col >= 0; col--) {
        if (!this.state.grid[row][col]) {
          isLine = false;
        }
      }

      if (isLine) {
        this._removeGridRow(row);
        linesCleared++;

        // Go once more through the same row
        row++;
      }
    }

    return linesCleared;
  },

  _removeGridRow: function(rowToRemove) {
    /**
     * Remove a row from the Well grid by descending all rows above, thus
     * overriding it with the previous row.
     */
    var row,
        col;

    for (row = rowToRemove; row >= 0; row--) {
      for (col = this.props.cols - 1; col >= 0; col--) {
        this.state.grid[row][col] = row ? this.state.grid[row - 1][col] : null;
      }
    }
  },

  _getTetriminoCSSSize: function() {
    return {
      width: 100 / this.props.cols * 4 + '%',
      height: 100 / this.props.rows * 4 + '%'
    };
  },

  _getActiveTetriminoCSSPosition: function() {
    var position =
      this._getGridPosition(this.state.activeTetriminoPosition);

    return {
      top: 100 / this.props.rows * position.y + '%',
      left: 100 / this.props.cols * position.x + '%'
    }
  },

  _getGridPosition: function(floatingPosition) {
    // The position has floating numbers because of how gravity is incremented
    // with each frame
    return {
      x: Math.floor(floatingPosition.x),
      y: Math.floor(floatingPosition.y)
    };
  },

  _getInitialPositionForTetriminoType: function(type) {
    /**
     * Generates positions a Tetrimino entering the Well. The I Tetrimino
     * occupies columns 4, 5, 6 and 7, the O Tetrimino occupies columns 5 and
     * 6, and the remaining 5 Tetriminos occupy columns 4, 5 and 6. Pieces
     * spawn above the visible playfield (that's why y is -2)
     */
    if (!type) {
      return {x: 0, y: 0};
    }

    var grid = constants.SHAPES[type];
    return {
      x: Math.round(this.props.cols / 2) - Math.round(grid[0].length / 2),
      y: -2
    };
  },

  _getDropStepForFrames: function(frames) {
    var dropFrames = this.state.dropAcceleration ?
                     constants.DROP_FRAMES_ACCELERATED : this.state.dropFrames;
    return frames / dropFrames;
  },

  _isPositionAvailableForTetriminoGrid: function(tetriminoGrid, position) {
    var tetriminoPositionInGrid = this._getGridPosition(position),
        tetriminoRows = tetriminoGrid.length,
        tetriminoCols = tetriminoGrid[0].length,
        row,
        col,
        relativeRow,
        relativeCol;

    for (row = 0; row < tetriminoRows; row++) {
      for (col = 0; col < tetriminoCols; col++) {
        // Ignore blank squares from the Tetrimino grid
        if (!tetriminoGrid[row][col]) {
          continue;
        }

        relativeRow = tetriminoPositionInGrid.y + row;
        relativeCol = tetriminoPositionInGrid.x + col;

        // Ensure Tetrimino block is within the horizontal bounds
        if (relativeCol < 0 || relativeCol >= this.props.cols) {
          return false;
        }

        // Tetriminos are accepted on top of the Well (it's how they enter)
        if (relativeRow < 0) {
          continue;
        }

        // Check check if Tetrimino hit the bottom of the Well
        if (relativeRow >= this.props.rows) {
          return false;
        }

        // Then if the position is not already taken inside the grid
        if (this.state.grid[relativeRow][relativeCol]) {
          return false;
        }
      }
    }

    return true;
  },

  _fitTetriminoGridPositionInWellBounds: function(tetriminoGrid, position) {
    var tetriminoRows = tetriminoGrid.length,
        tetriminoCols = tetriminoGrid[0].length,
        row,
        col,
        relativeRow,
        relativeCol;

    for (row = 0; row < tetriminoRows; row++) {
      for (col = 0; col < tetriminoCols; col++) {
        // Ignore blank squares from the Tetrimino grid
        if (!tetriminoGrid[row][col]) {
          continue;
        }

        relativeRow = position.y + row;
        relativeCol = position.x + col;

        // Wall kick: A Tetrimino grid that steps outside of the Well grid will
        // be shifted slightly to slide back inside the Well grid
        if (relativeCol < 0) {
          position.x -= relativeCol;
        } else if (relativeCol >= this.props.cols) {
          position.x -= relativeCol - this.props.cols + 1;
        }
      }
    }

    return position;
  },

  _getBottomMostPositionForTetriminoGrid: function(tetriminoGrid, position) {
    // Snap vertical position to grid
    position.y = Math.floor(position.y);
    while (!this._isPositionAvailableForTetriminoGrid(tetriminoGrid,
                                                      position)) {
      position.y -= 1;
    }

    return position;
  }
});
