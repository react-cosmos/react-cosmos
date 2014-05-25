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
  }
};
