import { STOPPED, PLAYING, PAUSED } from './constants/states';
import {
  WELL_ROWS,
  WELL_COLS,
  DROP_FRAMES_DEFAULT,
  DROP_FRAMES_DECREMENT,
  LINE_CLEAR_BONUSES,
} from './constants/grid';
import { SHAPES, COLORS } from './constants/tetrimino';
import {
  getRandomTetrimino,
  getInitialPositionForTetrimino,
} from './lib/tetrimino';
import {
  generateEmptyGrid,
  rotate,
  isPositionAvailable,
  getBottomMostPosition,
  transferTetriminoToGrid,
  clearLines,
  fitTetriminoPositionInWellBounds,
} from './lib/grid';

const reducers = {
  ADVANCE: (state, action) => {
    const {
      score,
      lines,
      nextTetrimino,
      grid,
      activeTetrimino,
      activeTetriminoGrid,
      activeTetriminoPosition,
      dropAcceleration,
      dropFrames,
    } = state;
    const { rows } = action.payload;

    let newPosition = Object.assign({}, activeTetriminoPosition, {
      y: activeTetriminoPosition.y + rows,
    });

    // The active Tetrimino keeps falling down until it hits something
    if (isPositionAvailable(grid, activeTetriminoGrid, newPosition)) {
      return Object.assign({}, state, {
        activeTetriminoPosition: newPosition,
      });
    }

    // A big frame skip could cause the Tetrimino to jump more than one row.
    // We need to ensure it ends up in the bottom-most one in case the jump
    // caused the Tetrimino to land
    newPosition = getBottomMostPosition(grid, activeTetriminoGrid, newPosition);

    // This is when the active Tetrimino hits the bottom of the Well and can
    // no longer be controlled
    const newGrid =
      transferTetriminoToGrid(grid, activeTetriminoGrid, newPosition, COLORS[activeTetrimino]);

    // Clear lines created after landing and transfering a Tetrimino
    const { clearedGrid, linesCleared } = clearLines(newGrid);

    // TODO: Calculate cells in Tetrimino. All current Tetriminos have 4 cells
    const cells = 4;

    // Rudimentary scoring logic, no T-Spin and combo bonuses. Read more at
    // http://tetris.wikia.com/wiki/Scoring
    let points = dropAcceleration ? cells * 2 : cells;
    if (linesCleared) {
      points += LINE_CLEAR_BONUSES[linesCleared - 1] * (lines + 1);
    }

    // Game over when well is full& and it should stop inserting any new
    // Tetriminos from this point on (until the Well is reset)
    const gameState = newPosition.y < 0 ? STOPPED : PLAYING;

    return Object.assign({}, state, {
      gameState,
      score: score + points,
      lines: lines + linesCleared,
      nextTetrimino: getRandomTetrimino(),
      grid: clearedGrid,
      activeTetrimino: nextTetrimino,
      activeTetriminoGrid: SHAPES[nextTetrimino],
      activeTetriminoPosition:
        getInitialPositionForTetrimino(nextTetrimino, WELL_COLS),
      // Increase speed whenever a line is cleared (fast game)
      dropFrames: linesCleared ? dropFrames - DROP_FRAMES_DECREMENT : dropFrames,
    });
  },

  START: (state) => {
    const nextTetrimino = getRandomTetrimino();
    const activeTetrimino = getRandomTetrimino();
    const activeTetriminoGrid = SHAPES[activeTetrimino];
    const activeTetriminoPosition =
      getInitialPositionForTetrimino(activeTetrimino, WELL_COLS);

    return Object.assign({}, state, {
      gameState: PLAYING,
      score: 0,
      lines: 0,
      nextTetrimino,
      grid: generateEmptyGrid(WELL_ROWS, WELL_COLS),
      activeTetrimino,
      activeTetriminoGrid,
      activeTetriminoPosition,
      dropFrames: DROP_FRAMES_DEFAULT,
      dropAcceleration: false,
    });
  },

  PAUSE: state => Object.assign({}, state, {
    gameState: PAUSED,
  }),

  RESUME: state => Object.assign({}, state, {
    gameState: PLAYING,
  }),

  MOVE: (state, action) => {
    const {
      grid,
      activeTetriminoGrid,
      activeTetriminoPosition,
    } = state;
    const { direction } = action.payload;

    const newPosition = Object.assign({}, activeTetriminoPosition, {
      x: activeTetriminoPosition.x + direction,
    });

    // Attempting to move the Tetrimino outside the Well bounds or over landed
    // Tetriminos will be ignored
    if (!isPositionAvailable(grid, activeTetriminoGrid, newPosition)) {
      return state;
    }

    return Object.assign({}, state, {
      activeTetriminoPosition: newPosition,
    });
  },

  ROTATE: (state) => {
    const {
      grid,
      activeTetriminoGrid,
      activeTetriminoPosition,
    } = state;

    const newGrid = rotate(activeTetriminoGrid);

    // If the rotation causes the active Tetrimino to go outside of the
    // Well bounds, its position will be adjusted to fit inside
    const newPosition =
      fitTetriminoPositionInWellBounds(grid, newGrid, activeTetriminoPosition);

    // If the rotation causes a collision with landed Tetriminos than it won't
    // be applied
    if (!isPositionAvailable(grid, newGrid, newPosition)) {
      return state;
    }

    return Object.assign({}, state, {
      activeTetriminoGrid: newGrid,
      activeTetriminoPosition: newPosition,
    });
  },

  ENABLE_ACCELERATION: state => Object.assign({}, state, {
    dropAcceleration: true,
  }),

  DISABLE_ACCELERATION: state => Object.assign({}, state, {
    dropAcceleration: false,
  }),
};

const flatrisReducer = (state, action) => (
  action.type in reducers ? reducers[action.type](state, action) : state
);

export default flatrisReducer;
