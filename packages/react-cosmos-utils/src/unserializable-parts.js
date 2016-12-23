import isPlainObject from 'lodash.isplainobject';

const isSerializable = (obj) => {
  if (
    obj === undefined ||
    obj === null |
    typeof obj === 'boolean' ||
    typeof obj === 'number' ||
    typeof obj === 'string'
  ) {
    return true;
  }

  if (!isPlainObject(obj) &&
      !Array.isArray(obj)) {
    return false;
  }

  let serializable = true;

  Object.keys(obj).forEach((key) => {
    if (!isSerializable(obj[key])) {
      serializable = false;
    }
  });

  return serializable;
};

const splitUnserializableParts = (obj) => {
  // TODO: Perform nested separation of unserializable parts. Required if props
  // will move to fixture.props https://github.com/react-cosmos/react-cosmos/issues/217
  const serializable = {};
  const unserializable = {};

  Object.keys(obj).forEach((key) => {
    if (isSerializable(obj[key])) {
      serializable[key] = obj[key];
    } else {
      unserializable[key] = obj[key];
    }
  });

  return { serializable, unserializable };
};

export default splitUnserializableParts;
