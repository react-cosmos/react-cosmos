import React from 'react';
import { withRouter } from 'react-router';

const RouteParams = ({ match: { params } }) => (
  <p>
    Showing user ID: <strong>{params.userId}</strong>.
  </p>
);

export default withRouter(RouteParams);
