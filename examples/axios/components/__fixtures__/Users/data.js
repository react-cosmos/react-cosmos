import Users from '../../Users';

export default {
  component: Users,

  xhr: [
    {
      url: '/users',
      response: (req, res) =>
        res.status(200).body([
          {
            id: 1,
            name: 'John'
          },
          {
            id: 2,
            name: 'Jessica'
          }
        ])
    }
  ]
};
