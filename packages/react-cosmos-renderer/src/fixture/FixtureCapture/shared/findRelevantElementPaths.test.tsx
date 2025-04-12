import React from 'react';
import { findRelevantElementPaths } from './findRelevantElementPaths.js';

it('does not crash when children array has holes', () => {
  // This used to cause a crash in Next.js server fixtures that receive
  // undefined children inside an array of children.
  // Example:
  //   export default <div>a{undefined}</div>

  const children = [];
  // Omitting this is essential to reproduce the issue
  // children[0] = undefined;
  children[1] = 'a';

  expect(
    findRelevantElementPaths(React.createElement('div', null, children))
  ).toEqual([]);
});
