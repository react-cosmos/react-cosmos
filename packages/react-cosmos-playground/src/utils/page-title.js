export function getPageTitle(params) {
  const { component, fixture } = params;
  const title = 'React Cosmos';

  // Set document title to the name of the selected fixture
  if (component && fixture) {
    return `${component}:${fixture} – ${title}`;
  }

  return title;
}
