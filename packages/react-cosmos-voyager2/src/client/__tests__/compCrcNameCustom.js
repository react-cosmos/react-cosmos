// @flow

import React from 'react';
import createReactClass from 'create-react-class';
import { getComponents } from '../getComponents';

const Strike = createReactClass({
  // Jest seems to automatically add a displayName equal to the filename, so a
  // test for default comp name with createReactClass would be a false positive
  displayName: 'Strike Style',
  render() {
    return <del>{this.props.name}</del>;
  }
});

describe('Custom name for createReactClass component', () => {
  let components;

  beforeEach(async () => {
    const fixtureFiles = [
      {
        filePath: '/path/to/foo.js',
        components: []
      }
    ];
    const fixtureModules = {
      '/path/to/foo.js': {
        component: Strike
      }
    };
    components = await getComponents({ fixtureFiles, fixtureModules });
  });

  it('has custom name', () => {
    expect(components[0].name).toBe('Strike Style');
  });
});
