// @flow

import { register } from 'react-plugin';

// TODO: How to import & register plugins more elegantly?
register(require('./plugins/Preview').default);
register(require('./plugins/Nav').default);
register(require('./plugins/ControlPanel').default);
