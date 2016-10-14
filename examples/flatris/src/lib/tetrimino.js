import _ from 'lodash';
import { SHAPES } from '../constants/tetrimino';

export function getRandomTetrimino() {
  return _.sample(_.keys(SHAPES));
}

export function getInitialPositionForTetrimino(type, gridCols) {
  /**
   * Generates positions a Tetrimino entering the Well. The I Tetrimino
   * occupies columns 4, 5, 6 and 7, the O Tetrimino occupies columns 5 and
   * 6, and the remaining 5 Tetriminos occupy columns 4, 5 and 6. Pieces
   * spawn above the visible playfield (that's why y is -2)
   */
  const grid = SHAPES[type];

  return {
    x: Math.round(gridCols / 2) - Math.round(grid[0].length / 2),
    y: -2,
  };
}
