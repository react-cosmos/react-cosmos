// @flow

import { register } from 'react-plugin';

// TODO: How to import & register plugins more elegantly?
register(require('./plugins/Preview').default);
