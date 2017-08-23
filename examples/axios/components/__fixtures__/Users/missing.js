export default {
  xhr: [
    {
      url: '/users',
      response: (req, res) => res.status(404)
    }
  ]
};
