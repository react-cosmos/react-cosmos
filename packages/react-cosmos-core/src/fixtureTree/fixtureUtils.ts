export function removeFixtureNameExtension(fixtureName: string) {
  return fixtureName.replace(/\.(js|jsx|ts|tsx|md|mdx)$/, '');
}

export function removeFixtureNameSuffix(
  fixtureNameWithoutExtension: string,
  suffix: string
) {
  return fixtureNameWithoutExtension.replace(new RegExp(`\\.${suffix}$`), '');
}
