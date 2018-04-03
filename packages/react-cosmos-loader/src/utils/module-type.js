import { shape, oneOf, oneOfType } from 'prop-types';

export function createModuleType(innerType) {
  return oneOfType([
    innerType,
    shape({
      __esModule: oneOf([true]),
      default: innerType
    })
  ]);
}
