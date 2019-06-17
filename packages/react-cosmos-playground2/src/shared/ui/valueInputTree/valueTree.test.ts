import {
  FixtureStateValue,
  FixtureStateValues
} from 'react-cosmos-shared2/fixtureState';
import { ValueNode } from './shared';
import { getFixtureStateValueTree } from './valueTree';

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
  object1: {
    type: 'object',
    values: {
      str2,
      num,
      bool,
      object2: {
        type: 'object',
        values: { str3, jsx }
      },
      array1: {
        type: 'array',
        values: [num, bool]
      }
    }
  }
};

const rootNode: ValueNode = {
  items: { str1 },
  dirs: {
    object1: {
      items: { str2, num, bool },
      dirs: {
        object2: {
          items: { str3, jsx },
          dirs: {}
        },
        array1: {
          items: { 0: num, 1: bool },
          dirs: {}
        }
      }
    }
  }
};

it('creates value tree', () => {
  expect(getFixtureStateValueTree(values)).toEqual(rootNode);
});
