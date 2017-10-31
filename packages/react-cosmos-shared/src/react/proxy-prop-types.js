import { shape, func, object } from 'prop-types';

export default {
  nextProxy: shape({
    value: func,
    next: func
  }).isRequired,
  fixture: object.isRequired,
  onComponentRef: func.isRequired,
  onFixtureUpdate: func.isRequired
};
