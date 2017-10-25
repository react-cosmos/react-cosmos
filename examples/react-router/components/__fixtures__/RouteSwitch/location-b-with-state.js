import RouteSwitch from '../../RouteSwitch';

export default {
  component: RouteSwitch,
  name: 'location-b with state',
  location: {
    pathname: '/b',
    state: {
      from: 'fixture'
    }
  }
};
