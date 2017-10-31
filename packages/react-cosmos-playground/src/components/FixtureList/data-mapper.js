import set from 'lodash.set';
import some from 'lodash.some';

function parseFixtureArray(componentName, fixtureArray) {
  const nestedData = {};
  const unnestedData = [];

  fixtureArray.forEach(fixturePath => {
    const [pre, post] = fixturePath.split('/');
    if (post) {
      const [folderName, fixtureName] = [pre, post];
      // fixturePath contains a folder
      nestedData[folderName] = nestedData[folderName] || [];
      nestedData[folderName].push(fixtureName);
    } else {
      const fixtureName = pre;
      unnestedData.push(fixtureName);
    }
  });

  // Nested folders go first
  const result = Object.keys(nestedData).map(key => ({
    name: key,
    expanded: true,
    type: 'fixtureDirectory',
    children: nestedData[key].map(fixture => ({
      type: 'fixture',
      name: fixture,
      urlParams: { component: componentName, fixture: `${key}/${fixture}` }
    }))
  }));

  // Unnested fixtures go last
  unnestedData.forEach(fixture => {
    result.push({
      type: 'fixture',
      name: fixture,
      urlParams: {
        component: componentName,
        fixture
      }
    });
  });

  return result;
}

const dataObjectToNestedArray = (base, path = '') => {
  const returnChildren = [];
  for (const key in base) {
    if (typeof base[key] === 'object') {
      const newPath = path ? `${path}/${key}` : key;
      const children = dataObjectToNestedArray(base[key], newPath);
      const isDirectory = some(
        children,
        child =>
          child.children &&
          (child.type === 'directory' || child.type === 'component')
      );
      returnChildren.push({
        name: key,
        expanded: true,
        type: isDirectory ? 'directory' : 'component',
        children
        // TODO: Enable this when we'll have component pages
        // https://github.com/react-cosmos/react-cosmos/issues/314
        // urlParams: { component: newPath }
      });
    } else {
      return parseFixtureArray(path, base);
    }
  }
  return returnChildren;
};

const fixturesToTreeData = fixtures => {
  const components = Object.keys(fixtures);
  const data = {};

  components.forEach(componentPath => {
    const pathArray = componentPath.split('/');
    const fixturesAtPath = fixtures[componentPath];
    set(data, pathArray, fixturesAtPath);
  });

  return dataObjectToNestedArray(data);
};

export default fixturesToTreeData;
