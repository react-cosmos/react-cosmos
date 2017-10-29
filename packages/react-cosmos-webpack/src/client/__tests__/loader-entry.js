import mount from '../mount';

jest.mock('../mount', () => ({
  __esModule: true,
  default: jest.fn()
}));

const hmrCbs = {};

// Unfortunately this doesn't work. The global module object is (probably)
// unique per module and can't be mocked. Leave this for posterity.
// module.hot = {
//   accept: (module, cb) => {
//     hmrCbs[module] = cb;
//   }
// };

require('../loader-entry');

it('mounts', () => {
  expect(mount).toHaveBeenCalledTimes(1);
});

it.skip('mounts again on hmr', () => {
  expect(Object.keys(hmrCbs)).toContain('./mount');
  hmrCbs['./mount']();
  expect(mount).toHaveBeenCalledTimes(2);
});
