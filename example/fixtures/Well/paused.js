var constants = require('../../src/constants.js');

module.exports = {
  rows: constants.WELL_ROWS,
  cols: constants.WELL_COLS,
  state: {
    activeTetrimino: 'T',
    activeTetriminoGrid: constants.SHAPES.T,
    activeTetriminoPosition: {
      x: 2,
      y: 13.508750000000028
    },
    animationLoopRunning: false,
    gridBlockCount: 1199,
    grid: [
      [null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null],
      [null,'1196#b04497',null,null,null,null,null,null,null,null],
      ['1197#b04497','1198#b04497','1199#b04497',null,null,null,null,null,null,null]
    ]
  }
};
