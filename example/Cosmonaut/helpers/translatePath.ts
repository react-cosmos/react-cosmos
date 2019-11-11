const X_OFFSET = 208;
const Y_OFFSET = 318;

export function translatePath(originalPath: string) {
  const pathParts = originalPath.replace(/(M|L|C)/g, `\n$1`).split(`\n`);
  pathParts.shift();
  const newPathPaths = pathParts.map(part => {
    const letter = part[0];
    const points = part
      .slice(1)
      .split(' ')
      .map(point => parseFloat(point));
    const convertedPoints = mapPathPoints(letter, points);
    return `${letter}${convertedPoints.map(point => String(point)).join(' ')}`;
  });
  return newPathPaths.join('');
}

function mapPathPoints(letter: string, points: number[]): number[] {
  if (letter === 'M' || letter === 'L') {
    return [points[0] - X_OFFSET, points[1] - Y_OFFSET];
  }

  return [
    points[0] - X_OFFSET,
    points[1] - Y_OFFSET,
    points[2] - X_OFFSET,
    points[3] - Y_OFFSET,
    points[4] - X_OFFSET,
    points[5] - Y_OFFSET
  ];
}
