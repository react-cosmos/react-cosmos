import {
  FixtureStateValue,
  FixtureStateValues
} from 'react-cosmos-shared2/fixtureState';
import { ValueNode, getFixtureStateValueTree } from './valueTree';

const str1: FixtureStateValue = {
  type: 'primitive',
  value: 'foo'
};

const str2: FixtureStateValue = {
  type: 'primitive',
  value: 'bar'
};

const str3: FixtureStateValue = {
  type: 'primitive',
  value: 'baz'
};

const num: FixtureStateValue = {
  type: 'primitive',
  value: 56
};

const bool: FixtureStateValue = {
  type: 'primitive',
  value: false
};

const jsx: FixtureStateValue = {
  type: 'unserializable',
  stringifiedValue: '<div />'
};

const values: FixtureStateValues = {
  str1,
  nested1: {
    type: 'composite',
    values: {
      str2,
      num,
      bool,
      nested2: {
        type: 'composite',
        values: { str3, jsx }
      }
    }
  }
};

const rootNode: ValueNode = {
  items: { str1 },
  dirs: {
    nested1: {
      items: { str2, num, bool },
      dirs: {
        nested2: {
          items: { str3, jsx },
          dirs: {}
        }
      }
    }
  }
};

it('creates value tree', () => {
  expect(getFixtureStateValueTree(values)).toEqual(rootNode);
});
