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
  mixins: [Cosmos.mixins.PersistState],
  getDefaultProps: function() {
    return {
      rows: 20,
      cols: 10
    };
  },
  getInitialState: function() {
    return {
      grid: this.generateEmptyMatrix(),
      // The active Tetrimino position will be reset whenever a new Tetrimino
      // is inserted in the Well, using the getTetriminoInitialPosition method
      activeTetriminoPosition: {
        x: 0,
        y: 0
      }
    };
  },
  children: {
    activeTetrimino: function(props) {
      return _.extend(props, {
        component: 'Tetrimino'
      });
    }
  },
  loadTetrimino: function(type) {
    var tetriminoGrid = Tetris.SHAPES[type];
    this.refs.activeTetrimino.setState({grid: tetriminoGrid});
    // Reset position to place new Tetrimino at the top entrance point
    this.setState({
      activeTetriminoPosition: this.getTetriminoInitialPosition(tetriminoGrid)
    });
  },
  render: function() {
    return (
      <div className="well">
        <div className="active-tetrimino"
             style={_.extend(this.getTetriminoSize(),
                             this.getTetriminoPosition())}>
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
  getTetriminoSize: function() {
    return {
      width: 100 / this.props.cols * 4 + '%',
      height: 100 / this.props.rows * 4 + '%'
    };
  },
  getTetriminoPosition: function() {
    return {
      top: 100 / this.props.rows * this.state.activeTetriminoPosition.y + '%',
      left: 100 / this.props.cols * this.state.activeTetriminoPosition.x + '%'
    }
  },
  getTetriminoInitialPosition: function(grid) {
    /**
     * Generates positions a Tetrimino entering the Well. The I Tetrimino
     * occupies columns 4, 5, 6 and 7, the O Tetrimino occupies columns 5 and
     * 6, and the remaining 5 Tetriminos occupy columns 4, 5 and 6. Pieces
     * spawn above the visible playfield (that's why y is -2)
     */
    return {
      x: Math.round(this.props.cols / 2) - Math.round(grid[0].length / 2),
      y: -2
    };
  }
});
