export function prepareComponents(modules) {
  const components = {};
  Object.keys(modules).forEach(componentName => {
    if (componentName.indexOf('_') !== 0) {
      components[componentName] = () => modules[componentName];
    }
  });
  return components;
}

export function prepareFixtures(modules, components) {
  const fixtures = {};
  Object.keys(components).forEach(componentName => {
    fixtures[componentName] = {};
    Object.keys(modules).forEach(fixtureName => {
      const componentPrefix = `${componentName}/`;
      if (fixtureName.indexOf(componentPrefix) === 0) {
        fixtures[componentName][fixtureName.slice(componentPrefix.length)] =
          () => modules[fixtureName];
      }
    });
  });
  return fixtures;
}
