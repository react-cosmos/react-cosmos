import React from 'react';
import SquareBlock from './SquareBlock';

require('./Tetrimino.less');

class Tetrimino extends React.Component {
  /**
   * A Tetromino is a geometric shape composed of four squares, connected
   * orthogonally. Read more at http://en.wikipedia.org/wiki/Tetromino
   */
  renderGridBlocks() {
    const blocks = [];
    const rows = this.props.grid.length;
    const cols = this.props.grid[0].length;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (this.props.grid[row][col]) {
          blocks.push(
            <li
              className="grid-square-block"
              key={`${row}-${col}`}
              style={{
                top: `${(row * 25)}%`,
                left: `${(col * 25)}%`,
              }}
            >
              <SquareBlock
                color={this.props.color}
              />
            </li>,
          );
        }
      }
    }

    return blocks;
  }

  render() {
    return (
      <ul className="tetrimino">
        {this.renderGridBlocks()}
      </ul>
    );
  }
}

Tetrimino.propTypes = {
  color: React.PropTypes.string.isRequired,
  grid: React.PropTypes.arrayOf(
    React.PropTypes.arrayOf(React.PropTypes.number),
  ).isRequired,
};

module.exports = Tetrimino;
