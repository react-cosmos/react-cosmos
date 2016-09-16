var constants = require('../../src/constants.js');

module.exports = {
  rows: constants.WELL_ROWS,
  cols: constants.WELL_COLS,
  state: {
    activeTetrimino: 'I',
    activeTetriminoGrid: [
      [0,0,1,0],
      [0,0,1,0],
      [0,0,1,0],
      [0,0,1,0]
    ],
    activeTetriminoPosition: {
      x: 1,
      y: 2.3896774193548396
    },
    animationLoopRunning: true,
    dropAcceleration: true,
    gridBlockCount: 1430,
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
      [null,null,null,null,null,null,'1423#fbb414','1424#fbb414',null,null],
      [null,null,null,null,'1415#3993d0','1416#3993d0','1425#fbb414','1426#fbb414','1427#95c43d',null],
      [null,null,null,null,'1417#3993d0','1399#ed652f','1407#fbb414','1408#fbb414','1428#95c43d','1429#95c43d'],
      [null,null,'1411#3cc7d6',null,'1418#3993d0','1400#ed652f','1409#fbb414','1410#fbb414','1403#95c43d','1430#95c43d'],
      [null,'1419#e84138','1412#3cc7d6',null,'1387#3cc7d6','1401#ed652f','1402#ed652f','1395#ed652f','1404#95c43d','1405#95c43d'],
      ['1420#e84138','1421#e84138','1413#3cc7d6',null,'1388#3cc7d6','1396#ed652f','1397#ed652f','1398#ed652f','1371#3cc7d6','1406#95c43d'],
      ['1422#e84138','1391#b04497','1414#3cc7d6',null,'1389#3cc7d6','1383#fbb414','1384#fbb414','1375#3993d0','1372#3cc7d6','1363#3cc7d6'],
      ['1392#b04497','1393#b04497','1379#3993d0',null,'1390#3cc7d6','1385#fbb414','1386#fbb414','1376#3993d0','1373#3cc7d6','1364#3cc7d6']
    ]
  }
};
