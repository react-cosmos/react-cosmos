import { FixtureStateValues } from './shared';
import { extendWithValues } from './extendWithValues';

it('extends string key', () => {
  const obj = { myProp: 'foo' };
  const values: FixtureStateValues = {
    myProp: {
      type: 'simple',
      value: 'bar'
    }
  };
  expect(extendWithValues(obj, values)).toEqual({ myProp: 'bar' });
});

it('extends number key', () => {
  const obj = { myProp: 56 };
  const values: FixtureStateValues = {
    myProp: {
      type: 'simple',
      value: 57
    }
  };
  expect(extendWithValues(obj, values)).toEqual({ myProp: 57 });
});

it('extends boolean key', () => {
  const obj = { myProp: false };
  const values: FixtureStateValues = {
    myProp: {
      type: 'simple',
      value: true
    }
  };
  expect(extendWithValues(obj, values)).toEqual({ myProp: true });
});

it('keeps undefined key', () => {
  const obj = { myProp: undefined };
  const values: FixtureStateValues = {};
  expect(extendWithValues(obj, values)).toEqual({ myProp: undefined });
});

it('keeps null key', () => {
  const obj = { myProp: null };
  const values: FixtureStateValues = {
    myProp: {
      type: 'simple',
      value: null
    }
  };
  expect(extendWithValues(obj, values)).toEqual({ myProp: null });
});

it('keeps unserializable function key', () => {
  const obj = { myProp: () => {} };
  const values: FixtureStateValues = {
    myProp: {
      type: 'unserializable',
      stringifiedValue: 'xxx'
    }
  };
  expect(extendWithValues(obj, values)).toEqual({ myProp: obj.myProp });
});

it('keeps unserializable regexp key', () => {
  const obj = { myProp: /impossible/g };
  const values: FixtureStateValues = {
    myProp: {
      type: 'unserializable',
      stringifiedValue: 'xxx'
    }
  };
  expect(extendWithValues(obj, values)).toEqual({ myProp: obj.myProp });
});

it('keeps empty object key', () => {
  const obj = { myProp: {} };
  const values: FixtureStateValues = {
    myProp: {
      type: 'object',
      values: {}
    }
  };
  expect(extendWithValues(obj, values)).toEqual({ myProp: {} });
});

it('extends serializable object key', () => {
  const obj = {
    myProp: { strProp: 'foo', numProp: 56, boolProp: false }
  };
  const values: FixtureStateValues = {
    myProp: {
      type: 'object',
      values: {
        strProp: {
          type: 'simple',
          value: 'bar'
        },
        numProp: {
          type: 'simple',
          value: 57
        },
        boolProp: {
          type: 'simple',
          value: true
        }
      }
    }
  };
  expect(extendWithValues(obj, values)).toEqual({
    myProp: { strProp: 'bar', numProp: 57, boolProp: true }
  });
});

it('extends partially serializable object key', () => {
  const obj = {
    myProp: { strProp: 'foo', fnProp: () => {} }
  };
  const values: FixtureStateValues = {
    myProp: {
      type: 'object',
      values: {
        strProp: {
          type: 'simple',
          value: 'bar'
        },
        fnProp: {
          type: 'unserializable',
          stringifiedValue: 'function () { }'
        }
      }
    }
  };
  expect(extendWithValues(obj, values)).toEqual({
    myProp: { strProp: 'bar', fnProp: obj.myProp.fnProp }
  });
});
