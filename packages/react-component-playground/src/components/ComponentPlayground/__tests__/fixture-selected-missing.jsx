import React from 'react';
import renderer from 'react-test-renderer';
import { Loader } from 'react-cosmos-loader';
import createStateProxy from 'react-cosmos-state-proxy';
import selectedMissing from '../__fixtures__/selected-missing';
import ComponentPlayground from '../';

test('CP with missing fixture selected', () => {
  const tree = renderer
    .create(
      <Loader
        proxies={[createStateProxy()]}
        component={ComponentPlayground}
        fixture={selectedMissing}
      />
    )
    .toJSON();
  console.log(tree);
  expect(tree).toMatchSnapshot();
});
