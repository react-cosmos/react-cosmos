import { SHAPES } from '../../../constants/tetrimino';

export default {
  grid: [
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, [1228, '#ed652f'], [1229, '#ed652f'], [1230, '#ed652f'], null, null, null, null],
    [null, null, null, [1231, '#ed652f'], [1216, '#fbb414'], [1217, '#fbb414'], null, [1224, '#e84138'], null, [1212, '#3cc7d6']],
    [[1220, '#ed652f'], [1221, '#ed652f'], [1222, '#ed652f'], [1200, '#b04497'], [1218, '#fbb414'], [1219, '#fbb414'], [1225, '#e84138'], [1226, '#e84138'], null, [1213, '#3cc7d6']],
    [[1223, '#ed652f'], [1196, '#b04497'], [1201, '#b04497'], [1202, '#b04497'], [1204, '#fbb414'], [1205, '#fbb414'], [1227, '#e84138'], [1208, '#b04497'], null, [1214, '#3cc7d6']],
  ],
  activeTetrimino: 'S',
  activeTetriminoGrid: SHAPES.S,
  activeTetriminoPosition: {
    x: 4,
    y: 6.834999999999979,
  },
};
