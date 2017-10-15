// @flow

import React from 'react';
import { getComponents } from '../get-components';

const Italic = ({ name }: { name: string }) => <em>{name}</em>;

describe('Inferred name for functional component', () => {
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
        component: Italic
      }
    };
    components = await getComponents({ fixtureFiles, fixtureModules });
  });

  it('has function name', () => {
    expect(components[0].name).toBe('Italic');
  });
});
