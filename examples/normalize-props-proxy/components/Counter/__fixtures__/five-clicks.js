import Counter from '../Counter';

// This fixture is using the old format of putting component props (i.e. `name`) at the root level
// NormalizePropsProxy upgrades the fixture to the new format by putting root level fields on `fixture.props`
// Those field names listed in the `notProps` proxy option are an exception to the above (they remain unmoved)
// See /proxies/normalize-props-proxy-with-options.js for the `notProps` option used in this example
export default {
  component: Counter,

  state: {
    value: 5
  },

  // `name` will get passed as a component prop by NormalizePropsProxy
  name: 'Awesome Counter',

  // `myMagicField` is listed in the NormalizePropsProxy option `notProps`, so it will not get passed as a component prop
  myMagicField: 'not a component prop'
};
