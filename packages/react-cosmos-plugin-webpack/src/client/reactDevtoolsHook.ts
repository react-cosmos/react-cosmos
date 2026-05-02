// Legacy fallback: copies the parent frame's React DevTools hook into this
// frame so the parent's DevTools instance can see React in the iframe. This
// predates the modern React DevTools extension, which auto-injects its hook
// into every frame on its own (facebook/react-devtools#76 was filed against
// the original, now-archived extension). It's effectively a no-op in current
// browsers — kept as a fallback for setups where neither DevTools nor React
// Refresh has installed a hook.
//
// Wiring constraint: this file is imported by hand in each renderer
// implementation. It must run *before* both user-defined global imports
// (which may import React) and the main renderer entry (which imports
// fixtures and decorators) — anything that imports React after this file
// will see the hook we put in place.
if (process.env.NODE_ENV === 'development') {
  type DevtoolsWindow = Window & {
    __REACT_DEVTOOLS_GLOBAL_HOOK__?: unknown;
  };
  const ownWindow = window as DevtoolsWindow;
  // Accessing the parent window can throw when loading a static export without
  // a web server (i.e. via file:/// protocol)
  try {
    // Skip when this frame already has a hook — either DevTools auto-injected
    // it, or React Refresh installed a patched stub. Overwriting that stub
    // would drop the patches and silently break Fast Refresh inside the
    // iframe (HMR completes but components never re-render).
    if (!ownWindow.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      const parentWindow = window.parent as DevtoolsWindow;
      ownWindow.__REACT_DEVTOOLS_GLOBAL_HOOK__ =
        parentWindow.__REACT_DEVTOOLS_GLOBAL_HOOK__;
    }
  } catch {
    console.warn('Could not access parent React devtools hook');
  }
}
