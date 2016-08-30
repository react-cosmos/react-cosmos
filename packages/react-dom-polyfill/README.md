# React DOM Polyfill

Publish React libs that work with *almost* all React versions.

Considering the cost of upgrading in big orgs, older versions of React (<0.14, pre ReactDOM) are still used in large codebases. React DOM Polyfill allows you to publish libs that work both with latest React and older versions (starting with 0.12), by proxying how your lib interacts with DOM in React.

Usage:
```js
// CommonJS
var React = require('react');
var ReactDOM = require('react-dom-polyfill')(React);

// ES6
import React from 'react';
import ReactDOMPolyfill from 'react-dom-polyfill';

const ReactDOM = ReactDOMPolyfill(React);
```

Notes:
- Update your React/ReactDOM peer dependencies to make your published lib compatible with all React versions. The latter should be optional. This is a rough example:
  ```json
  "peerDependencies": {
    "react": ">=0.12 <16"
  },
  "optionalDependencies": {
    "react-dom": "<16"
  }
  ```
- Even though calling `findDOMNode` on DOM element refs is no longer required in newer versions of React, you must always use it to account for older Reacts. This makes this polyfill somewhat *special*. E.g.
  ```js
  // Polyfill will simply return this.refs.searchInput with newer React versions,
  // but will call this.refs.searchInput.getDOMNode() with older versions
  ReactDOM.findDOMNode(this.refs.searchInput)
  ```
