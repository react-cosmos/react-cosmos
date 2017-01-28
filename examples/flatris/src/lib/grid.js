
export function generateEmptyGrid(rows, cols) {
  const matrix = [];

  for (let row = 0; row < rows; row++) {
    matrix[row] = [];
    for (let col = 0; col < cols; col++) {
      matrix[row][col] = null;
    }
  }

  return matrix;
}

export function rotate(grid) {
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
}

export function getExactPosition({ x, y }) {
  // The position has floating numbers because of how gravity is incremented
  // with each frame
  return {
    x: Math.floor(x),
    y: Math.floor(y),
  };
}

export function isPositionAvailable(grid, tetriminoGrid, position) {
  const rows = grid.length;
  const cols = grid[0].length;
  const tetriminoRows = tetriminoGrid.length;
  const tetriminoCols = tetriminoGrid[0].length;
  const tetriminoPositionInGrid = getExactPosition(position);
  let relativeRow;
  let relativeCol;

  for (let row = 0; row < tetriminoRows; row++) {
    for (let col = 0; col < tetriminoCols; col++) {
      // Ignore blank squares from the Tetrimino grid
      if (tetriminoGrid[row][col]) {
        relativeRow = tetriminoPositionInGrid.y + row;
        relativeCol = tetriminoPositionInGrid.x + col;

        // Ensure Tetrimino block is within the horizontal bounds
        if (relativeCol < 0 || relativeCol >= cols) {
          return false;
        }

        // Check check if Tetrimino hit the bottom of the Well
        if (relativeRow >= rows) {
          return false;
        }

        // Tetriminos are accepted on top of the Well (it's how they enter)
        if (relativeRow >= 0) {
          // Then if the position is not already taken inside the grid
          if (grid[relativeRow][relativeCol]) {
            return false;
          }
        }
      }
    }
  }

  return true;
}

export function getBottomMostPosition(grid, tetriminoGrid, position) {
  // Snap vertical position to grid
  let y = Math.floor(position.y);

  while (!isPositionAvailable(grid, tetriminoGrid, { x: position.x, y })) {
    y -= 1;
  }

  return Object.assign({}, position, { y });
}

const getMaxIdFromLine = line =>
  Math.max(...line.map(cell => (cell ? cell[0] : 0)));

const getMaxIdFromGrid = grid =>
  Math.max(...grid.map(line => getMaxIdFromLine(line)));

export function transferTetriminoToGrid(grid, tetriminoGrid, position, color) {
  const rows = tetriminoGrid.length;
  const cols = tetriminoGrid[0].length;
  const tetriminoPositionInGrid = getExactPosition(position);
  const newGrid = grid.map(l => l.map(c => c));
  let relativeRow;
  let relativeCol;
  let cellId = getMaxIdFromGrid(newGrid);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Ignore blank squares from the Tetrimino grid
      if (tetriminoGrid[row][col]) {
        relativeCol = tetriminoPositionInGrid.x + col;
        relativeRow = tetriminoPositionInGrid.y + row;

        // When the Well is full the Tetrimino will land before it enters the
        // top of the Well
        if (newGrid[relativeRow]) {
          newGrid[relativeRow][relativeCol] = [++cellId, color];
        }
      }
    }
  }

  return newGrid;
}

const createEmptyLine = cols => [...Array(cols)].map(() => null);

const isLine = row => !row.some(cell => cell === null);

export function clearLines(grid) {
  /**
   * Clear all rows that form a complete line, from one left to right, inside
   * the Well grid. Gravity is applied to fill in the cleared lines with the
   * ones above, thus freeing up the Well for more Tetriminos to enter.
   */
  const rows = grid.length;
  const cols = grid[0].length;
  const clearedGrid = grid.map(l => l);
  let linesCleared = 0;

  for (let row = rows - 1; row >= 0; row--) {
    if (isLine(clearedGrid[row])) {
      for (let row2 = row; row2 >= 0; row2--) {
        clearedGrid[row2] = row2 > 0 ? clearedGrid[row2 - 1] : createEmptyLine(cols);
      }

      linesCleared++;

      // Go once more through the same row
      row++;
    }
  }

  return {
    clearedGrid,
    linesCleared,
  };
}

export function fitTetriminoPositionInWellBounds(grid, tetriminoGrid, { x, y }) {
  const cols = grid[0].length;
  const tetriminoRows = tetriminoGrid.length;
  const tetriminoCols = tetriminoGrid[0].length;
  let newX = x;
  let relativeCol;

  for (let row = 0; row < tetriminoRows; row++) {
    for (let col = 0; col < tetriminoCols; col++) {
      // Ignore blank squares from the Tetrimino grid
      if (tetriminoGrid[row][col]) {
        relativeCol = newX + col;

        // Wall kick: A Tetrimino grid that steps outside of the Well grid will
        // be shifted slightly to slide back inside the Well grid
        if (relativeCol < 0) {
          newX -= relativeCol;
        } else if (relativeCol >= cols) {
          newX -= (relativeCol - cols) + 1;
        }
      }
    }
  }

  return {
    x: newX,
    y,
  };
}
