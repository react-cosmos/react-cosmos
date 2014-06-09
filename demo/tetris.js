var Tetris = {
  COLORS: {
    I: '#6febec',
    O: '#f3e92f',
    T: '#8c4eee',
    J: '#0044ed',
    L: '#e6a130',
    S: '#78e400',
    Z: '#db3a2f'
  },
  // The Shapes and their rotation was inspired from
  // http://tetris.wikia.com/wiki/SRS
  SHAPES: {
    I: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    O: [
      [1, 1],
      [1, 1],
    ],
    T: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    J: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    L: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    S: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ],
    Z: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ]
  },
  WELL_ROWS: 20,
  WELL_COLS: 10,
  DROP_FRAMES_DEFAULT: 48,
  DROP_FRAMES_DECREMENT: 1.5,
  DROP_FRAMES_ACCELERATED: 1.5,
  LINE_CLEAR_BONUSES: [100, 300, 500, 800],
  KEYS: {
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39
  }
};
