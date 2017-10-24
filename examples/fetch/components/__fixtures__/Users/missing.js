import Users from '../../Users';

export default {
  component: Users,

  fetch: [
    {
      matcher: '/users',
      response: 404
    }
  ]
};
