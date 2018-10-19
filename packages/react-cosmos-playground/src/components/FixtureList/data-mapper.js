import set from 'lodash.set';
import some from 'lodash.some';
import sortBy from 'lodash.sortby';

const NODE_ORDER_BY_TYPE = ['directory', 'component'];

function getExandedValue(savedExpansionState, path, defaultValue) {
  return Object.prototype.hasOwnProperty.call(savedExpansionState, path)
    ? savedExpansionState[path]
    : defaultValue;
}

function parseFixtureArray(componentName, fixtureArray, savedExpansionState) {
  const nestedData = {};
  const unnestedData = [];

  fixtureArray.forEach(fixturePath => {
    // Only one level of indentation is supported by the fixture namespace
    const parts = fixturePath.split('/');
    if (parts.length > 1) {
      const fixtureName = parts.pop();
      const folderName = parts.join('/');
      // fixturePath contains a folder
      nestedData[folderName] = nestedData[folderName] || [];
      nestedData[folderName].push(fixtureName);
    } else {
      unnestedData.push(parts[0]);
    }
  });

  // Nested folders go first
  const result = Object.keys(nestedData).map(folderName => {
    const newPath = `${componentName}/${folderName}`;
    return {
      name: folderName,
      expanded: getExandedValue(savedExpansionState, newPath, false),
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

const extractHocNames = string => {
  const splitString = string.split('(');
  let componentName = splitString.pop();
  const hocs = splitString;

  if (hocs.length > 0) {
    // Remove trailing )s from componentName
    componentName = componentName.slice(0, -hocs.length);
  }

  return { componentName, hocs };
};

const generateDisplayData = name => {
  const { componentName, hocs } = extractHocNames(name);
  return {
    componentName,
    hocs,
    search: `${componentName} ${hocs.join(', ')}`.trim()
  };
};

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
      let displayData = null;
      if (!isDirectory) {
        displayData = generateDisplayData(key);
      }
      returnChildren.push({
        name: key,
        path: newPath,
        expanded: getExandedValue(savedExpansionState, newPath, isDirectory),
        type: isDirectory ? 'directory' : 'component',
        displayData,
        children
        // TODO: Enable this when we'll have component pages
        // https://github.com/react-cosmos/react-cosmos/issues/314
        // urlParams: { component: newPath }
      });
    } else {
      return parseFixtureArray(path, base, savedExpansionState);
    }
  }

  return sortBy(returnChildren, node => NODE_ORDER_BY_TYPE.indexOf(node.type));
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
