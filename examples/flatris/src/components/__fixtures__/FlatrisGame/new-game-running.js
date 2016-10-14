import { PLAYING } from '../../../constants/states';
import {
  WELL_ROWS,
  WELL_COLS,
  DROP_FRAMES_DEFAULT,
} from '../../../constants/grid';
import { SHAPES } from '../../../constants/tetrimino';
import {
  generateEmptyGrid,
} from '../../../lib/grid';

module.exports = {
  reduxState: {
    gameState: PLAYING,
    score: 0,
    lines: 0,
    nextTetrimino: 'I',
    grid: generateEmptyGrid(WELL_ROWS, WELL_COLS),
    activeTetrimino: 'J',
    activeTetriminoGrid: SHAPES.J,
    activeTetriminoPosition: { x: 4, y: -2 },
    dropFrames: DROP_FRAMES_DEFAULT,
    dropAcceleration: false,
  },
};
