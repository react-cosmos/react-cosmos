import React from 'react';
import { loadChild } from '../../src/load-child';

describe('UNIT Load missing child', () => {
  let component;

  beforeEach(() => {
    component = {
      children: {
        missingChild: () => ({}),
      },
    };

    sinon.stub(React, 'createElement').callsFake(() => {
      throw new Error('Invalid component');
    });

    sinon.stub(console, 'error');
  });

  afterEach(() => {
    React.createElement.restore();

    console.error.restore();
  });

  it('should handle exception', () => {
    expect(() => {
      loadChild(component, 'missingChild');
    }).to.not.throw();
  });

  it('should log error', () => {
    loadChild(component, 'missingChild');

    expect(console.error.lastCall.args[0]).to.be.an.instanceof(Error);
  });
});
