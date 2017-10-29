import Users from '../../Users';

export default {
  component: Users,

  fetch: [
    {
      matcher: '/users',
      response: [
        {
          id: 1,
          name: 'John'
        },
        {
          id: 2,
          name: 'Jessica'
        }
      ]
    }
  ]
};
