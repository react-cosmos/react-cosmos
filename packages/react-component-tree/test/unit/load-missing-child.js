/* eslint-env node, mocha */
/* global expect, sinon */

import React from 'react';
import { loadChild } from '../../src/load-child.js';

describe('UNIT Load missing child', () => {
  let component;

  beforeEach(() => {
    component = {
      children: {
        missingChild: () => ({}),
      },
    };

    sinon.stub(React, 'createElement', () => {
      throw new Error('Invalid component');
    });

    sinon.stub(console, 'error');
  });

  afterEach(() => {
    React.createElement.restore();

    // eslint-disable-next-line no-console
    console.error.restore();
  });

  it('should handle exception', () => {
    expect(() => {
      loadChild(component, 'missingChild');
    }).to.not.throw();
  });

  it('should log error', () => {
    loadChild(component, 'missingChild');

    // eslint-disable-next-line no-console
    expect(console.error.lastCall.args[0]).to.be.an.instanceof(Error);
  });
});
