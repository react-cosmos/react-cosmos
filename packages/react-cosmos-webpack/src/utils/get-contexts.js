// The following constants are replaced at compile-time (through module-loader)
// with a map of require.context calls with absolute paths, derived from user
// conf. By the time webpack analyzes this file to build the dependency tree
// all paths will be embedded and webpack will register watchers for each
// context (which will update the bundle automatically when files are added or
// changed).
/* eslint-disable no-undef */
export const getComponentContexts = () => COMPONENT_CONTEXTS;
export const getFixtureContexts = () => FIXTURE_CONTEXTS;
/* eslint-enable no-undef */
