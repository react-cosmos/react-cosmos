const X_OFFSET = 208;
const Y_OFFSET = 318;

export function translatePath(
  originalPath: string,
  _xOffset: number = 0,
  _yOffset: number = 0
) {
  function mapPathPoints(letter: string, points: number[]): number[] {
    let xOffset = X_OFFSET + _xOffset;
    let yOffset = Y_OFFSET + _yOffset;
    if (letter === 'M' || letter === 'L') {
      return [points[0] - xOffset, points[1] - yOffset];
    }

    return [
      points[0] - xOffset,
      points[1] - yOffset,
      points[2] - xOffset,
      points[3] - yOffset,
      points[4] - xOffset,
      points[5] - yOffset
    ];
  }

  const pathParts = originalPath.replace(/(M|L|C)/g, `\n$1`).split(`\n`);
  pathParts.shift();
  const newPathPaths = pathParts.map(part => {
    const letter = part[0];
    const points = part
      .slice(1)
      .split(' ')
      .map(point => parseFloat(point));
    const convertedPoints = mapPathPoints(letter, points);
    return `${letter}${convertedPoints
      .map(point => point.toFixed(2))
      .join(' ')}`;
  });
  return newPathPaths.join('');
}
