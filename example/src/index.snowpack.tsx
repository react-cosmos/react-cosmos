import React from 'react';
import {
  createPostMessageConnect,
  FixtureLoader,
} from 'react-cosmos-shared2/FixtureLoader';
import { render } from 'react-dom';
// @ts-ignore
import { decorators, fixtures } from './cosmos.userdeps.js';

render(
  <FixtureLoader
    rendererId="snowpack-renderer"
    rendererConnect={createPostMessageConnect()}
    fixtures={fixtures}
    selectedFixtureId={null}
    systemDecorators={[]}
    userDecorators={decorators}
  />,
  document.getElementById('root')
);
