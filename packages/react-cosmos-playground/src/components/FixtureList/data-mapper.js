import set from 'lodash.set';
import some from 'lodash.some';

function getExandedValue(savedExpansionState, path) {
  return Object.prototype.hasOwnProperty.call(savedExpansionState, path)
    ? savedExpansionState[path]
    : true;
}

function parseFixtureArray(componentName, fixtureArray, savedExpansionState) {
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
  const result = Object.keys(nestedData).map(folderName => {
    const newPath = `${componentName}/${folderName}`;
    return {
      name: folderName,
      expanded: getExandedValue(savedExpansionState, newPath),
      type: 'fixtureDirectory',
      path: newPath,
      children: nestedData[folderName].map(fixture => ({
        type: 'fixture',
        name: fixture,
        urlParams: {
          component: componentName,
          fixture: `${folderName}/${fixture}`
        }
      }))
    };
  });

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

const dataObjectToNestedArray = (base, savedExpansionState, path = '') => {
  const returnChildren = [];
  for (const key in base) {
    if (typeof base[key] === 'object') {
      const newPath = path ? `${path}/${key}` : key;
      const children = dataObjectToNestedArray(
        base[key],
        savedExpansionState,
        newPath
      );
      const isDirectory = some(
        children,
        child =>
          child.children &&
          (child.type === 'directory' || child.type === 'component')
      );
      returnChildren.push({
        name: key,
        path: newPath,
        expanded: getExandedValue(savedExpansionState, newPath),
        type: isDirectory ? 'directory' : 'component',
        children
        // TODO: Enable this when we'll have component pages
        // https://github.com/react-cosmos/react-cosmos/issues/314
        // urlParams: { component: newPath }
      });
    } else {
      return parseFixtureArray(path, base, savedExpansionState);
    }
  }
  return returnChildren;
};

const fixturesToTreeData = (fixtures, savedExpansionState) => {
  const components = Object.keys(fixtures);
  const data = {};

  components.forEach(componentPath => {
    const pathArray = componentPath.split('/');
    const fixturesAtPath = fixtures[componentPath];
    set(data, pathArray, fixturesAtPath);
  });

  return dataObjectToNestedArray(data, savedExpansionState);
};

export default fixturesToTreeData;
