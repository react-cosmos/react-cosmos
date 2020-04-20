const ORIGINAL_X_OFFSET = -208;
const ORIGINAL_Y_OFFSET = -318;

export function translateOriginalPath(
  originalPath: string,
  xOffset: number = 0,
  yOffset: number = 0
) {
  return translatePath(
    originalPath,
    ORIGINAL_X_OFFSET + xOffset,
    ORIGINAL_Y_OFFSET + yOffset
  );
}

export function translatePath(
  originalPath: string,
  xOffset: number,
  yOffset: number
) {
  function mapPathPoints(letter: string, points: number[]): number[] {
    if (letter === 'M' || letter === 'L') {
      return [points[0] + xOffset, points[1] + yOffset];
    }

    return [
      points[0] + xOffset,
      points[1] + yOffset,
      points[2] + xOffset,
      points[3] + yOffset,
      points[4] + xOffset,
      points[5] + yOffset,
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
