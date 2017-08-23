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

  if (!isPlainObject(obj) && !Array.isArray(obj)) {
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
  const serializable = {};
  const unserializable = {};

  Object.keys(obj).forEach(key => {
    if (isSerializable(obj[key])) {
      serializable[key] = obj[key];
    } else if (key === 'props' && isPlainObject(obj[key])) {
      Object.keys(obj.props).forEach(propKey => {
        const propVal = obj.props[propKey];
        const propHome = isSerializable(propVal)
          ? serializable
          : unserializable;

        if (!propHome.props) {
          propHome.props = {};
        }
        propHome.props[propKey] = propVal;
      });
    } else {
      unserializable[key] = obj[key];
    }
  });

  return { serializable, unserializable };
};

export default splitUnserializableParts;
