import ProvideRouterProps from '../../ProvideRouterProps';

export default [
  {
    component: ProvideRouterProps,
    name: 'enabled',
    route: '/user/:userId',
    url: '/user/5',
    provideRouterProps: true
  },
  {
    component: ProvideRouterProps,
    name: 'disabled',
    route: '/user/:userId',
    url: '/user/5',
    provideRouterProps: false
  }
];
