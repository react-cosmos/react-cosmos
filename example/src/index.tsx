import 'regenerator-runtime/runtime';
import React from 'react';
import {
  createWebSocketsConnect,
  FixtureLoader,
} from 'react-cosmos-shared2/FixtureLoader';
import { renderMessage } from 'react-cosmos/dist/dom/renderMessage';
import { render } from 'react-dom';
// @ts-ignore
import { rendererConfig, fixtures, decorators } from './cosmos.userdeps';

render(
  <FixtureLoader
    rendererId={'snowpack-renderer'}
    rendererConnect={createWebSocketsConnect('localhost:5002')}
    fixtures={fixtures}
    selectedFixtureId={null}
    systemDecorators={[]}
    userDecorators={decorators}
    renderMessage={renderMessage}
    onErrorReset={() => console.log('onErrorReset')}
  />,
  document.getElementById('root')
);

console.log(fixtures);
