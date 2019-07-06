import { FixtureState } from 'react-cosmos-shared2/fixtureState';

// Types can't be re-exported because Babel (see root tsconfig.json)
export type FixtureState = FixtureState;

// Use in renderers
export { FixtureLoader } from './FixtureLoader';
export { createPostMessageConnect } from './FixtureLoader/postMessage';
export { createWebSocketsConnect } from './FixtureLoader/webSockets';

// Use in decorators
export { FixtureContext } from './FixtureContext';

// Advanced: Use in fixtures to capture elements in render callback
export { FixtureCapture } from './FixtureCapture';

// Use in fixtures
export { Viewport } from './Viewport';
