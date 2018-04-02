// @flow

import path from 'path';
import React from 'react';
import { getMock } from 'react-cosmos-flow/jest';
import runTests from '..';

jest.mock('./__fsmocks__/fixtures', () => {
  const Foo = ({ what }: { what: string }) => <span>Foo is {what}</span>;
  const Bar = ({ what }: { what: string }) => <span>Bar is {what}</span>;

  return [
    {
      component: Foo,
      name: 'foo',
      props: {
        what: 'foo'
      }
    },
    {
      component: Foo,
      name: 'bar',
      props: {
        what: 'bar'
      }
    },
    {
      component: Bar,
      name: 'qux',
      props: {
        what: 'qux'
      }
    }
  ];
});

const toMatchSnapshot = jest.fn();

beforeEach(async () => {
  jest.clearAllMocks();

  global.actualTest = test;
  global.test = jest.fn();

  global.actualExpect = expect;
  global.expect = jest.fn(() => ({ toMatchSnapshot }));

  await runTests({
    cosmosConfigPath: path.join(__dirname, '__fsmocks__/cosmos.config.js')
  });
});

afterEach(() => {
  global.test = global.actualTest;
  global.expect = global.actualExpect;
});

test('creates test for all fixtures', () => {
  global.actualExpect(getMock(test).calls[0][0]).toBe('Cosmos fixtures');
});

test('expects each fixture to match snapshot', async () => {
  const testCb = getMock(test).calls[0][1];
  await testCb();

  global.actualExpect(expect).toHaveBeenCalledWith({
    type: 'span',
    props: {},
    children: ['Foo is ', 'foo']
  });
  global.actualExpect(toMatchSnapshot).toHaveBeenCalledWith('Foo:foo');

  global.actualExpect(expect).toHaveBeenCalledWith({
    type: 'span',
    props: {},
    children: ['Foo is ', 'bar']
  });
  global.actualExpect(toMatchSnapshot).toHaveBeenCalledWith('Foo:bar');

  global.actualExpect(expect).toHaveBeenCalledWith({
    type: 'span',
    props: {},
    children: ['Bar is ', 'qux']
  });
  global.actualExpect(toMatchSnapshot).toHaveBeenCalledWith('Bar:qux');
});
