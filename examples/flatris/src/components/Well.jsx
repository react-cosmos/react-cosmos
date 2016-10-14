import React from 'react';
import { COLORS } from '../constants/tetrimino';
import { getExactPosition } from '../lib/grid';
import WellGrid from './WellGrid';
import Tetrimino from './Tetrimino';

require('./Well.less');

class Well extends React.Component {
  /**
   * A rectangular vertical shaft, where Tetriminos fall into during a Flatris
   * game. The Well has configurable size and speed. Tetrimino pieces can be
   * inserted inside the well and they will fall until they hit the bottom, and
   * eventually fill it. Whenever the pieces form a straight horizontal line it
   * will be cleared, emptying up space and allowing more pieces to enter
   * afterwards.
   */
  shouldComponentUpdate(nextProps) {
    return (
      nextProps.grid !== this.props.grid ||
      nextProps.activeTetrimino !== this.props.activeTetrimino ||
      nextProps.activeTetriminoGrid !== this.props.activeTetriminoGrid ||
      nextProps.activeTetriminoPosition !== this.props.activeTetriminoPosition
    );
  }

  getNumberOfRows() {
    return this.props.grid.length;
  }

  getNumberOfCols() {
    return this.props.grid[0].length;
  }

  getActiveTetriminoStyles() {
    const rows = this.getNumberOfRows();
    const cols = this.getNumberOfCols();
    const { x, y } = getExactPosition(this.props.activeTetriminoPosition);

    return {
      top: `${(100 / rows) * y}%`,
      left: `${(100 / cols) * x}%`,
      width: `${(100 / cols) * 4}%`,
      height: `${(100 / rows) * 4}%`,
    };
  }

  render() {
    return (
      <div className="well">
        {this.props.activeTetrimino ? (
          <div
            className="active-tetrimino"
            style={this.getActiveTetriminoStyles()}
          >
            <Tetrimino
              color={COLORS[this.props.activeTetrimino]}
              grid={this.props.activeTetriminoGrid}
            />
          </div>
        ) : null}
        <WellGrid
          grid={this.props.grid}
        />
      </div>
    );
  }
}

Well.propTypes = {
  grid: React.PropTypes.arrayOf(
    React.PropTypes.arrayOf(React.PropTypes.array)
  ).isRequired,
  activeTetrimino: React.PropTypes.string,
  activeTetriminoGrid: React.PropTypes.arrayOf(
    React.PropTypes.arrayOf(React.PropTypes.number)
  ),
  activeTetriminoPosition: React.PropTypes.shape({
    x: React.PropTypes.number,
    y: React.PropTypes.number,
  }),
};

export default Well;
