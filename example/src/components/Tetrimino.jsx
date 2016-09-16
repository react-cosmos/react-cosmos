var React = require('react'),
    constants = require('../constants.js'),
    SquareBlock = require('./SquareBlock.jsx');

require('./Tetrimino.less');

class Tetrimino extends React.Component {
  /**
   * A Tetromino is a geometric shape composed of four squares, connected
   * orthogonally. Read more at http://en.wikipedia.org/wiki/Tetromino
   */
  render() {
    return <ul className="tetrimino">
      {this._renderGridBlocks()}
    </ul>;
  }

  _renderGridBlocks() {
    var blocks = [],
        rows = this.props.grid.length,
        cols = this.props.grid[0].length,
        row,
        col;

    for (row = 0; row < rows; row++) {
      for (col = 0; col < cols; col++) {
        if (this.props.grid[row][col]) {
          blocks.push(
            <li className="grid-square-block"
                key={row + '-' + col}
                style={{
                  top: (row * 25) + '%',
                  left: (col * 25) + '%'
                }}>
              <SquareBlock
                ref={`c${col}r${row}`}
                color={this.props.color}
              />
            </li>
          );
        }
      }
    }

    return blocks;
  }

  getNumberOfCells() {
    // TODO: Count actual cells (so far all Tetriminos have 4 cells)
    return 4;
  }
}

Tetrimino.defaultProps = {
  color: constants.COLORS.T,
  grid: constants.SHAPES.T
};

module.exports = Tetrimino;
