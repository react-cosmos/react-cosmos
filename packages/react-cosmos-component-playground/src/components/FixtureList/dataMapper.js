import set from 'lodash.set';

const dataObjectToNestedArray = (base, path = '') => {
  const returnChildren = [];
  for (const key in base) {
    if (typeof base[key] === 'object') {
      const newPath = path ? `${path}/${key}` : key;
      const children = dataObjectToNestedArray(base[key], newPath);
      returnChildren.push({
        name: key,
        expanded: true,
        component: newPath,
        children
      });
    } else {
      const fixtures = base.map(fixture => ({
        name: fixture,
        component: path
      }));
      return fixtures;
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

// const input = {
//   "dirA/Component1": ["fixtureA", "fixtureB"],
//   "dirB/Component2": ["fixtureA", "fixtureB"],
//   "dirB/Component3": ["fixtureA", "fixtureB"],
//   "dirB/subdirA/Component4": ["fixtureA", "fixtureB"],
// };

// const output = [
//   {
//     name: "dirA",
//     expanded: true,
//     component: "dirA",
//     children: [
//       {
//         name: "Component1",
//         expanded: true,
//         component: "dirA/Component1",
//         children: [
//           { name: "fixtureA", component: "dirA/Component1" },
//           { name: "fixtureB", component: "dirA/Component1" },
//         ],
//       },
//     ],
//   },
//   {
//     name: "dirB",
//     expanded: true,
//     component: "dirB",
//     children: [
//       {
//         name: "Component2",
//         expanded: true,
//         component: "dirB/Component2",
//         children: [
//           { name: "fixtureA", component: "dirB/Component2" },
//           { name: "fixtureB", component: "dirB/Component2" },
//         ],
//       },
//       {
//         name: "Component3",
//         expanded: true,
//         component: "dirB/Component3",
//         children: [
//           { name: "fixtureA", component: "dirB/Component3" },
//           { name: "fixtureB", component: "dirB/Component3" },
//         ],
//       },
//       {
//         name: "subdirA",
//         expanded: true,
//         component: "dirB/subdirA",
//         children: [
//           {
//             name: "Component4",
//             expanded: true,
//             component: "dirB/subdirA/Component4",
//             children: [
//               { name: "fixtureA", component: "dirB/subdirA/Component4" },
//               { name: "fixtureB", component: "dirB/subdirA/Component4" },
//             ],
//           },
//         ],
//       },
//     ],
//   },
// ];
