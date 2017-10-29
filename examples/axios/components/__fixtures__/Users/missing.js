import Users from '../../Users';

export default {
  component: Users,

  xhr: [
    {
      url: '/users',
      response: (req, res) => res.status(404)
    }
  ]
};
