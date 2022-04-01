import { mountDomRenderer } from 'react-cosmos/dom';
// @ts-ignore
import { decorators, fixtures } from './cosmos.userdeps.js';

mountDomRenderer({
  rendererConfig: { containerQuerySelector: '#root' },
  decorators,
  fixtures,
});
