import set from 'lodash.set';
import some from 'lodash.some';

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
      const isDirectory = some(children, child => child.children);
      returnChildren.push({
        name: key,
        path: newPath,
        expanded: Object.prototype.hasOwnProperty.call(
          savedExpansionState,
          newPath
        )
          ? savedExpansionState[newPath]
          : true,
        type: isDirectory ? 'directory' : 'component',
        children
        // TODO: Enable this when we'll have component pages
        // https://github.com/react-cosmos/react-cosmos/issues/314
        // urlParams: { component: newPath }
      });
    } else {
      const fixtures = base.map(fixture => ({
        name: fixture,
        type: 'fixture',
        urlParams: { component: path, fixture }
      }));
      return fixtures;
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

// const input = {
//   "dirA/Component1": ["fixtureA", "fixtureB"],
//   "dirB/Component2": ["fixtureA", "fixtureB"],
//   "dirB/Component3": ["fixtureA", "fixtureB"],
//   "dirB/subdirA/Component4": ["fixtureA", "fixtureB"],
// };

// const output = [
//   {
//     name: 'dirA',
//     expanded: true,
//     children: [
//       {
//         name: 'Component1',
//         expanded: true,
//         children: [
//           {
//             name: 'fixtureA',
//             urlParams: {
//               component: 'dirA/Component1',
//               fixture: 'fixtureA'
//             }
//           },
//           {
//             name: 'fixtureB',
//             urlParams: {
//               component: 'dirA/Component1',
//               fixture: 'fixtureB'
//             }
//           }
//         ]
//       }
//     ]
//   },
//   {
//     name: 'dirB',
//     expanded: true,
//     children: [
//       {
//         name: 'Component2',
//         expanded: true,
//         children: [
//           {
//             name: 'fixtureA',
//             urlParams: {
//               component: 'dirB/Component2',
//               fixture: 'fixtureA'
//             }
//           },
//           {
//             name: 'fixtureB',
//             urlParams: {
//               component: 'dirB/Component2',
//               fixture: 'fixtureB'
//             }
//           }
//         ]
//       },
//       {
//         name: 'Component3',
//         expanded: true,
//         children: [
//           {
//             name: 'fixtureA',
//             urlParams: {
//               component: 'dirB/Component3',
//               fixture: 'fixtureA'
//             }
//           },
//           {
//             name: 'fixtureB',
//             urlParams: {
//               component: 'dirB/Component3',
//               fixture: 'fixtureB'
//             }
//           }
//         ]
//       },
//       {
//         name: 'subdirA',
//         expanded: true,
//         children: [
//           {
//             name: 'Component4',
//             expanded: true,
//             children: [
//               {
//                 name: 'fixtureA',
//                 urlParams: {
//                   component: 'dirB/subdirA/Component4',
//                   fixture: 'fixtureA'
//                 }
//               },
//               {
//                 name: 'fixtureB',
//                 urlParams: {
//                   component: 'dirB/subdirA/Component4',
//                   fixture: 'fixtureB'
//                 }
//               }
//             ]
//           }
//         ]
//       }
//     ]
//   }
// ];
