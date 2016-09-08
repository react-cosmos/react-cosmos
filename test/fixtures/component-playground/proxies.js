/* eslint-disable
  react/prefer-es6-class,
  react/prefer-stateless-function,
  react/no-multi-comp,
  react/prop-types
*/

import _ from 'lodash';
import React from 'react';
import selectedFixture from './selected-fixture.js';

const PropMutatorProxy = React.createClass({
  render() {
    return React.cloneElement(this.props.children,
      _.assign({}, this.props.children.props, { myProp: true }));
  },
});

const MarkupProxy = React.createClass({
  render() {
    return React.createElement('div', {
      children: [React.createElement('span',
        { ref: 'textSpan', children: 'Add some text near component' }),
        this.props.children,
      ],
    });
  },
});

module.exports = _.merge({}, selectedFixture, {
  proxies: [{
    component: PropMutatorProxy,
    ref: 'PropMutatorProxy',
  }, {
    component: MarkupProxy,
    ref: 'MarkupProxy',
  }],
});

