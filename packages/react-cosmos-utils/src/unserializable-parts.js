import isPlainObject from 'lodash.isplainobject';

const isSerializable = obj => {
  if (
    obj === undefined ||
    obj === null ||
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

  Object.keys(obj).forEach(key => {
    if (!isSerializable(obj[key])) {
      serializable = false;
    }
  });

  return serializable;
};

const splitUnserializableParts = obj => {
  const serializable = { props: {} };
  const unserializable = { props: {} };

  Object.keys(obj).forEach(key => {
    if (isSerializable(obj[key])) {
      serializable[key] = obj[key];
    } else if (key === 'props' && isPlainObject(obj[key])) {
      Object.keys(obj.props).forEach(propKey => {
        if (isSerializable(obj.props[propKey])) {
          serializable.props[propKey] = obj.props[propKey];
        } else {
          unserializable.props[propKey] = obj.props[propKey];
        }
      });
    } else {
      unserializable[key] = obj[key];
    }
  });

  return { serializable, unserializable };
};

export default splitUnserializableParts;
