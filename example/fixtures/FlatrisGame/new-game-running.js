const constants = require('../../src/constants');
const grid = require('../../src/lib/grid');

module.exports = {
  reduxState: {
    cols: constants.WELL_COLS,
    rows: constants.WELL_ROWS,
    grid: grid.generateEmptyMatrix(constants.WELL_ROWS, constants.WELL_COLS),
    gridBlockCount: 0,
    playing: true,
    paused: false,
    score: 0,
    lines: 0,
    nextTetrimino: 'I',
    dropFrames: constants.DROP_FRAMES_DEFAULT,
    dropAcceleration: false,
    activeTetrimino: 'J',
    activeTetriminoGrid: constants.SHAPES.J,
    activeTetriminoPosition: { x: 4, y: -2 },
    animationLoopRunning: true,
  },
};
