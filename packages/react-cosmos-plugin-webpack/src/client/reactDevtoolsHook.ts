// TLDR: This has to be done before React is imported
// https://github.com/facebook/react-devtools/issues/76#issuecomment-128091900
// More context: User-defined "global imports" have to be imported *after* this
// file (because they can import React), but *before* the main renderer entry
// point (because the user's global imports have to take effect before we
// import fixture and decorator modules). For this reason this file has to be
// imported by hand in each renderer implementation.
type DevtoolsWindow = Window & {
  __REACT_DEVTOOLS_GLOBAL_HOOK__?: unknown;
};

if (process.env.NODE_ENV === 'development') {
  const ownWindow = window as DevtoolsWindow;
  // Accessing the parent window can throw when loading a static export without
  // a web server (i.e. via file:/// protocol)
  try {
    // Only copy the parent's hook when this frame doesn't already have one.
    // React Refresh installs a patched hook from a prepended entry that runs
    // before this file; overwriting it here drops those patches and breaks
    // Fast Refresh inside the iframe. Modern React DevTools also injects its
    // hook into every frame on its own, so the copy-from-parent fallback is
    // only needed when neither is present.
    if (!ownWindow.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      const parentWindow = window.parent as DevtoolsWindow;
      ownWindow.__REACT_DEVTOOLS_GLOBAL_HOOK__ =
        parentWindow.__REACT_DEVTOOLS_GLOBAL_HOOK__;
    }
  } catch {
    console.warn('Could not access parent React devtools hook');
  }
}
