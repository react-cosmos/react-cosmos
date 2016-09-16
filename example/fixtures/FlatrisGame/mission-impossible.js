var constants = require('../../src/constants.js');

module.exports = {
  state: {
    playing: true,
    paused: true,
    nextTetrimino: 'S',
    score: 352,
    lines: 1,

    children: {
      well: {
        activeTetrimino: 'T',
        activeTetriminoGrid: constants.SHAPES.T,
        activeTetriminoPosition: {x: 7, y: 1.4775000000000023},
        animationLoopRunning: false,
        gridBlockCount: 1601,
        grid: [
          [null,null,null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null,null,null],
          ['1594#b04497','1595#b04497','1596#b04497','1598#fbb414','1599#fbb414',null,null,null,null,null],
          [null,'1597#b04497',null,'1600#fbb414','1601#fbb414','1586#ed652f','1590#fbb414','1591#fbb414',null,null],
          [null,'1570#95c43d','1571#95c43d','1587#ed652f','1588#ed652f','1589#ed652f','1592#fbb414','1593#fbb414','1582#95c43d','1583#95c43d'],
          ['1572#95c43d','1573#95c43d','1574#3993d0',null,null,'1578#3993d0',null,'1584#95c43d','1585#95c43d',null],
          ['1566#b04497',null,'1575#3993d0','1576#3993d0','1577#3993d0','1579#3993d0','1580#3993d0','1581#3993d0',null,null],
          ['1567#b04497','1568#b04497','1558#ed652f','1559#ed652f','1560#ed652f',null,'1562#3cc7d6','1563#3cc7d6','1564#3cc7d6','1565#3cc7d6'],
          ['1569#b04497',null,'1561#ed652f',null,null,'1550#ed652f','1551#ed652f','1552#ed652f','1554#fbb414','1555#fbb414'],
          ['1546#b04497','1547#b04497','1548#b04497','1538#3cc7d6','1542#3993d0','1553#ed652f',null,null,'1556#fbb414','1557#fbb414'],
          [null,'1549#b04497',null,'1539#3cc7d6','1543#3993d0','1544#3993d0','1545#3993d0','1534#95c43d','1535#95c43d','1530#3993d0'],
          ['1522#ed652f','1523#ed652f','1524#ed652f','1540#3cc7d6','1526#b04497',null,'1536#95c43d','1537#95c43d',null,'1531#3993d0'],
          [null,'1520#fbb414','1521#fbb414','1541#3cc7d6',null,'1510#3993d0',null,'1516#e84138','1517#e84138',null],
          [null,null,'1506#b04497','1507#b04497','1508#b04497','1511#3993d0','1512#3993d0','1513#3993d0','1498#95c43d','1499#95c43d'],
          ['1494#fbb414','1495#fbb414',null,'1509#b04497','1502#95c43d','1503#95c43d',null,'1500#95c43d','1501#95c43d',null],
          ['1496#fbb414','1497#fbb414','1478#95c43d','1504#95c43d','1505#95c43d','1490#95c43d','1491#95c43d','1486#3993d0',null,null],
          ['1474#3993d0',null,'1479#95c43d','1480#95c43d','1492#95c43d','1493#95c43d',null,'1487#3993d0','1488#3993d0','1489#3993d0'],
          ['1475#3993d0','1476#3993d0','1477#3993d0','1481#95c43d','1482#3cc7d6','1483#3cc7d6','1484#3cc7d6','1485#3cc7d6',null,null]
        ]
      }
    }
  }
};
