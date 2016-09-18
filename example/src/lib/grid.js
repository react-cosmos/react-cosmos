exports.generateEmptyMatrix = (rows, cols) => {
  const matrix = [];

  for (let row = 0; row < rows; row++) {
    matrix[row] = [];
    for (let col = 0; col < cols; col++) {
      matrix[row][col] = null;
    }
  }

  return matrix;
};

exports.rotate = (grid) => {
  const matrix = [];
  const rows = grid.length;
  const cols = grid[0].length;

  for (let row = 0; row < rows; row++) {
    matrix[row] = [];
    for (let col = 0; col < cols; col++) {
      matrix[row][col] = grid[cols - 1 - col][row];
    }
  }

  return matrix;
};
