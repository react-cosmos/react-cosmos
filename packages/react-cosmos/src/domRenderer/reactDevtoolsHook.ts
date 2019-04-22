// TLDR: This has to be done before React is imported
// https://github.com/facebook/react-devtools/issues/76#issuecomment-128091900
// More context: User-defined "global imports" have to be imported *after* this
// file (because they can import React), but *before* the main renderer entry
// point (because the user's global imports have to take effect before we
// import fixture and decorator modules). For this reason this file has to be
// imported by hand in each renderer implementation.
if (process.env.NODE_ENV === 'development') {
  // Accessing the parent window can throw when loading a static export without
  // a web server (i.e. via file:/// protocol)
  try {
    (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ = (window.parent as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
  } catch (err) {
    console.warn('Could not access parent React devtools hook');
  }
}
