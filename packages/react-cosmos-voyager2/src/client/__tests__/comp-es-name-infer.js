// @flow

import React, { Component } from 'react';
import { getComponents } from '../get-components';

class Bold extends Component<{ name: string }> {
  render() {
    return <strong>{this.props.name}</strong>;
  }
}

describe('Inferred name for ES Class component', () => {
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
        component: Bold
      }
    };
    components = await getComponents({ fixtureFiles, fixtureModules });
  });

  it('has class name', () => {
    expect(components[0].name).toBe('Bold');
  });
});
