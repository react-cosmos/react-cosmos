import React from 'react';
import { ValueInputTree } from '.';

export default (
  <ValueInputTree
    id="root"
    values={{
      object: {
        type: 'object',
        values: {
          element: {
            type: 'unserializable',
            stringifiedValue: '<div />'
          }
        }
      },
      string: {
        type: 'primitive',
        value: 'hello world'
      },
      number: {
        type: 'primitive',
        value: 1337
      }
    }}
    treeExpansion={{ object: true }}
    onValueChange={values => console.log('on change', values)}
    onTreeExpansionChange={newTreeExpansion =>
      console.log('set tree expansion', newTreeExpansion)
    }
  />
);
