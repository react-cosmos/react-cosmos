const React = require('react');
const SquareBlock = require('./SquareBlock');

require('./WellGrid.less');

class WellGrid extends React.Component {
  /**
   * Isolated matrix for the Tetriminos that landed inside the Well.
   */
  shouldComponentUpdate(nextProps) {
    return nextProps.gridBlockCount !== this.props.gridBlockCount;
  }

  getIdFromBlockValue(blockValue) {
    return blockValue.split('#')[0];
  }

  getColorFromBlockValue(blockValue) {
    return `#${blockValue.split('#')[1]}`;
  }

  renderGridBlocks() {
    const blocks = [];
    const rows = this.props.grid.length;
    const cols = this.props.grid[0].length;
    const widthPercent = 100 / cols;
    const heightPercent = 100 / rows;
    let blockValue;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (this.props.grid[row][col]) {
          blockValue = this.props.grid[row][col];
          blocks.push(
            <li
              className="grid-square-block"
              key={this.getIdFromBlockValue(blockValue)}
              style={{
                width: `${widthPercent}%`,
                height: `${heightPercent}%`,
                top: `${(row * heightPercent)}%`,
                left: `${(col * widthPercent)}%`,
              }}
            >
              <SquareBlock
                color={this.getColorFromBlockValue(blockValue)}
              />
            </li>);
        }
      }
    }

    return blocks;
  }

  render() {
    return (<ul className="well-grid">
      {this.renderGridBlocks()}
    </ul>);
  }
}

WellGrid.propTypes = {
  grid: React.PropTypes.arrayOf(
    React.PropTypes.array
  ),
  gridBlockCount: React.PropTypes.number,
};

module.exports = WellGrid;
