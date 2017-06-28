import { shape, oneOf, oneOfType } from 'prop-types';

export default innerType =>
  oneOfType([
    innerType,
    shape({
      __esModule: oneOf([true]),
      default: innerType,
    }),
  ]);
