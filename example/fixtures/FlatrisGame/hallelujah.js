var constants = require('../../src/constants.js');

module.exports = {
  state: {
    playing: true,
    paused: false,
    nextTetrimino: 'S',
    score: 184,
    lines: 0,

    children: {
      well: {
        activeTetrimino: 'I',
        activeTetriminoGrid: [
          [0,0,1,0],
          [0,0,1,0],
          [0,0,1,0],
          [0,0,1,0]
        ],
        activeTetriminoPosition: {x: 7, y: 14.716249999999997},
        animationLoopRunning: true,
        gridBlockCount: 1979,
        grid: [
          [null,null,null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,'1972#95c43d',null,null],
          [null,null,null,null,null,null,null,'1973#95c43d','1974#95c43d',null],
          [null,null,null,null,null,null,null,'1968#b04497','1975#95c43d',null],
          [null,null,null,null,null,null,'1952#e84138','1969#b04497','1970#b04497',null],
          [null,null,null,null,null,'1953#e84138','1954#e84138','1971#b04497','1964#e84138',null],
          [null,null,null,null,null,'1955#e84138','1948#e84138','1965#e84138','1966#e84138',null],
          [null,null,null,null,null,'1949#e84138','1950#e84138','1967#e84138','1960#b04497',null],
          [null,null,null,null,null,'1951#e84138','1944#e84138','1961#b04497','1962#b04497',null],
          [null,null,null,null,null,'1945#e84138','1946#e84138','1956#b04497','1963#b04497',null],
          [null,'1928#3993d0','1929#3993d0','1976#ed652f',null,'1947#e84138','1957#b04497','1958#b04497','1959#b04497',null],
          [null,'1930#3993d0','1920#3cc7d6','1977#ed652f',null,'1940#fbb414','1941#fbb414','1936#ed652f','1937#ed652f',null],
          ['1904#b04497','1931#3993d0','1921#3cc7d6','1978#ed652f','1979#ed652f','1942#fbb414','1943#fbb414','1924#e84138','1938#ed652f',null],
          ['1905#b04497','1906#b04497','1922#3cc7d6','1916#3993d0','1932#fbb414','1933#fbb414','1925#e84138','1926#e84138','1939#ed652f',null],
          ['1907#b04497','1892#e84138','1923#3cc7d6','1917#3993d0','1934#fbb414','1935#fbb414','1927#e84138','1912#ed652f','1908#3993d0',null],
          ['1893#e84138','1894#e84138','1918#3993d0','1919#3993d0','1896#95c43d','1913#ed652f','1914#ed652f','1915#ed652f','1909#3993d0',null],
          ['1895#e84138','1884#b04497','1888#e84138','1889#e84138','1897#95c43d','1898#95c43d','1900#3993d0','1910#3993d0','1911#3993d0',null],
          ['1885#b04497','1886#b04497','1887#b04497','1890#e84138','1891#e84138','1899#95c43d','1901#3993d0','1902#3993d0','1903#3993d0',null]
        ]
      }
    }
  }
};
