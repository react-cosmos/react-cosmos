// @flow

import React, { Component } from 'react';
import { getComponents } from '../get-components';

function generateComponent() {
  return class Bold extends Component<{ name: string }> {
    render() {
      return <strong>{this.props.name}</strong>;
    }
  };
}

describe('Inferred duplicate name for ES Class components', () => {
  let components;

  beforeEach(async () => {
    const fixtureFiles = [
      {
        filePath: '/path/to/foo.js',
        components: []
      },
      {
        filePath: '/path/to/bar.js',
        components: []
      }
    ];
    const fixtureModules = {
      '/path/to/foo.js': {
        component: generateComponent()
      },
      '/path/to/bar.js': {
        component: generateComponent()
      }
    };
    components = await getComponents({ fixtureFiles, fixtureModules });
  });

  it('has unique class names', () => {
    expect(components[0].name).toBe('Bold');
    expect(components[1].name).toBe('Bold (1)');
  });
});
