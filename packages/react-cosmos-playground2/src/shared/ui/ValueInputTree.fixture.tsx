import React from 'react';
import { ValueInputTree } from './ValueInputTree';

export default (
  <ValueInputTree
    elementId={{
      decoratorId: 'root',
      elPath: ''
    }}
    values={{
      string: {
        type: 'primitive',
        value: 'hello world'
      },
      number: {
        type: 'primitive',
        value: 1337
      }
    }}
    onChange={(elementId, values) => console.log('on change', values)}
  />
);
