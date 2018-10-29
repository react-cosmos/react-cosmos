/* global window */

// This has to be done before React is imported. So this files has to be
// imported before anything which might import React
// https://github.com/facebook/react-devtools/issues/76#issuecomment-128091900
if (process.env.NODE_ENV === 'development') {
  // Accessing the parent window can throw when loading a static export without
  // a web server (i.e. via file:/// protocol)
  try {
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__ =
      window.parent.__REACT_DEVTOOLS_GLOBAL_HOOK__;
  } catch (err) {
    console.warn('Could not access parent React devtools hook');
  }
}
