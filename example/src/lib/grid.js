exports.generateEmptyMatrix = function(rows, cols) {
  var matrix = [],
      row,
      col;

  for (row = 0; row < rows; row++) {
    matrix[row] = [];
    for (col = 0; col < cols; col++) {
      matrix[row][col] = null;
    }
  }

  return matrix;
};

exports.rotate = function(grid) {
  var matrix = [],
      rows = grid.length,
      cols = grid[0].length,
      row,
      col;

  for (row = 0; row < rows; row++) {
    matrix[row] = [];
    for (col = 0; col < cols; col++) {
      matrix[row][col] = grid[cols - 1 - col][row];
    }
  }

  return matrix;
};
