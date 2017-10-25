import RouteSwitch from '../../RouteSwitch';

export default {
  component: RouteSwitch,
  name: 'url-b with state',
  location: {
    pathname: '/b',
    state: {
      from: 'fixture'
    }
  }
};
