/** @jsx React.DOM */

Cosmos.components.Well = React.createClass({
  /**
   * A rectangular vertical shaft, where Tetriminos fall into during a Tetris
   * game. The Well has configurable size, speed. Tetrimino pieces can be
   * inserted inside the well and they will fall until they hit the bottom,
   * continuously filling it. Whenever the pieces form a straight horizontal
   * line it will be cleared, emptying up space and allowing more pieces to
   * enter afterwards.
   */
  mixins: [Cosmos.mixins.PersistState,
           Cosmos.mixins.AnimationLoop],
  getDefaultProps: function() {
    return {
      rows: Tetris.WELL_ROWS,
      cols: Tetris.WELL_COLS
    };
  },
  getInitialState: function() {
    return {
      grid: this.generateEmptyMatrix(),
      activeTetrimino: null,
      // The active Tetrimino position will be reset whenever a new Tetrimino
      // is inserted in the Well, using the getInitialPositionForTetriminoType
      // method
      activeTetriminoPosition: {x: 0, y: 0},
      dropFrames: Tetris.DROP_FRAMES_DEFAULT,
      dropAcceleration: null
    };
  },
  children: {
    activeTetrimino: function() {
      if (!this.state.activeTetrimino) {
        return;
      }
      return {
        component: 'Tetrimino',
        color: Tetris.COLORS[this.state.activeTetrimino]
      };
    }
  },
  loadTetrimino: function(type) {
    this.setState({
      activeTetrimino: type,
      // Reset position to place new Tetrimino at the top entrance point
      activeTetriminoPosition: this.getInitialPositionForTetriminoType(type)
    });
    if (type) {
      // Child state should only be touched imperatively, it is managed
      // internally inside Tetrimino Component afterwards
      this.refs.activeTetrimino.setState({grid: Tetris.SHAPES[type]});
    }
  },
  rotateTetrimino: function() {
    if (this.state.activeTetrimino) {
      var tetriminoGrid = this.refs.activeTetrimino.getRotatedGrid(),
          tetriminoPosition = this.fitTetriminoGridPositionInWellBounds(
            tetriminoGrid, this.state.activeTetriminoPosition);
      if (this.isPositionAvailableForTetriminoGrid(tetriminoGrid,
                                                   tetriminoPosition)) {
        this.refs.activeTetrimino.setState({grid: tetriminoGrid});
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
    var tetriminoGrid = this.refs.activeTetrimino.state.grid,
        tetriminoPosition = _.clone(this.state.activeTetriminoPosition);
    tetriminoPosition.x += offset;
    if (this.isPositionAvailableForTetriminoGrid(tetriminoGrid,
                                                 tetriminoPosition)) {
      this.setState({activeTetriminoPosition: tetriminoPosition});
    }
  },
  increaseSpeed: function() {
    this.setState({dropFrames: this.state.dropFrames -
                               Tetris.DROP_FRAMES_DECREMENT});
  },
  onFrame: function(frames) {
    if (!this.state.activeTetrimino) {
      return;
    }
    var tetriminoGrid = this.refs.activeTetrimino.state.grid,
        tetriminoPosition = _.clone(this.state.activeTetriminoPosition),
        dropFrames = this.state.dropAcceleration ?
                     Tetris.DROP_FRAMES_ACCELERATED : this.state.dropFrames,
        dropStep = frames / dropFrames;
    tetriminoPosition.y += dropStep;
    if (this.isPositionAvailableForTetriminoGrid(tetriminoGrid,
                                                 tetriminoPosition)) {
      this.setState({activeTetriminoPosition: tetriminoPosition});
    } else {
      // A big frame skip could cause the Tetrimino to jump more than one row.
      // We need to ensure it ends up in the bottom-most one in case the jump
      // caused the Tetrimino to land
      this.setState({activeTetriminoPosition:
        this.getBottomMostPositionForTetriminoGrid(tetriminoGrid,
                                                   tetriminoPosition)});
      // This is when the active Tetrimino hit the bottom of the Well and can
      // no longer be controlled
      this.transferActiveTetriminoBlocksToGrid();
      // Unload Tetrimino after landing it
      this.loadTetrimino(null);
    }
  },
  render: function() {
    return (
      <div className="well">
        <div className="active-tetrimino"
             style={_.extend(this.getTetriminoCSSSize(),
                             this.getActiveTetriminoCSSPosition())}>
          {this.loadChild('activeTetrimino')}
        </div>
        <ul className="well-grid">
          {this.renderGridBlocks()}
        </ul>
      </div>
    );
  },
  renderGridBlocks: function() {
    var blocks = [],
        widthPercent = 100 / this.props.cols,
        heightPercent = 100 / this.props.rows,
        row,
        col;
    for (row = 0; row < this.props.rows; row++) {
      for (col = 0; col < this.props.cols; col++) {
        if (this.state.grid[row][col]) {
          blocks.push(
            <li className="grid-square-block"
                key={row + '-' + col}
                style={{
                  width: widthPercent + '%',
                  height: heightPercent + '%',
                  top: (row * heightPercent) + '%',
                  left: (col * widthPercent) + '%'
                }}>
              <Cosmos component="SquareBlock"
                      color={this.state.grid[row][col]} />
            </li>
          );
        }
      }
    }
    return blocks;
  },
  generateEmptyMatrix: function() {
    var matrix = [],
        row,
        col;
    for (row = 0; row < this.props.rows; row++) {
      matrix[row] = [];
      for (col = 0; col < this.props.cols; col++) {
        matrix[row][col] = false;
      }
    }
    return matrix;
  },
  getTetriminoCSSSize: function() {
    return {
      width: 100 / this.props.cols * 4 + '%',
      height: 100 / this.props.rows * 4 + '%'
    };
  },
  getActiveTetriminoCSSPosition: function() {
    var position =
      this.getGridPosition(this.state.activeTetriminoPosition);
    return {
      top: 100 / this.props.rows * position.y + '%',
      left: 100 / this.props.cols * position.x + '%'
    }
  },
  getGridPosition: function(floatingPosition) {
    // The position has floating numbers because of how gravity is incremented
    // with each frame
    return {
      x: Math.floor(floatingPosition.x),
      y: Math.floor(floatingPosition.y)
    };
  },
  getInitialPositionForTetriminoType: function(type) {
    /**
     * Generates positions a Tetrimino entering the Well. The I Tetrimino
     * occupies columns 4, 5, 6 and 7, the O Tetrimino occupies columns 5 and
     * 6, and the remaining 5 Tetriminos occupy columns 4, 5 and 6. Pieces
     * spawn above the visible playfield (that's why y is -2)
     */
    if (!type) {
      return {x: 0, y: 0};
    }
    var grid = Tetris.SHAPES[type];
    return {
      x: Math.round(this.props.cols / 2) - Math.round(grid[0].length / 2),
      y: -2
    };
  },
  isPositionAvailableForTetriminoGrid: function(tetriminoGrid, position) {
    var tetriminoPositionInGrid = this.getGridPosition(position),
        tetriminoRows = tetriminoGrid.length,
        tetriminoCols = tetriminoGrid[0].length,
        wellRows = this.state.grid.length,
        wellCols = this.state.grid[0].length,
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
        if (relativeCol < 0 || relativeCol >= wellCols) {
          return false;
        }
        // Tetriminos are accepted on top of the Well (it's how they enter)
        if (relativeRow < 0) {
          continue;
        }
        // Check check if Tetrimino hit the bottom of the Well
        if (relativeRow >= wellRows) {
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
  fitTetriminoGridPositionInWellBounds: function(tetriminoGrid, position) {
    var tetriminoRows = tetriminoGrid.length,
        tetriminoCols = tetriminoGrid[0].length,
        wellCols = this.state.grid[0].length,
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
        } else if (relativeCol >= wellCols) {
          position.x -= relativeCol-wellCols+1;
        }
      }
    }
    return position;
  },
  getBottomMostPositionForTetriminoGrid: function(tetriminoGrid, position) {
    // Snap vertical position to grid
    position.y = Math.floor(position.y);
    while (!this.isPositionAvailableForTetriminoGrid(tetriminoGrid, position)) {
      position.y -= 1;
    }
    return position;
  },
  transferActiveTetriminoBlocksToGrid: function() {
    var tetrimino = this.refs.activeTetrimino,
        tetriminoPositionInGrid =
          this.getGridPosition(this.state.activeTetriminoPosition),
        rows = tetrimino.state.grid.length,
        cols = tetrimino.state.grid[0].length,
        row,
        col,
        relativeRow,
        relativeCol;
    for (row = 0; row < rows; row++) {
      for (col = 0; col < cols; col++) {
        // Ignore blank squares from the Tetrimino grid
        if (!tetrimino.state.grid[row][col]) {
          continue;
        }
        relativeRow = tetriminoPositionInGrid.y + row;
        relativeCol = tetriminoPositionInGrid.x + col;
        this.state.grid[relativeRow][relativeCol] = tetrimino.props.color;
      }
    }
    // Push grid updates reactively
    this.setState({grid: this.state.grid});
  }
});
