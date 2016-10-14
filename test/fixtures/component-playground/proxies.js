/* eslint-disable
  react/prefer-es6-class,
  react/prefer-stateless-function,
  react/no-multi-comp,
  react/prop-types
*/

import React from 'react';
import selectedFixture from './selected-fixture.js';

const PropMutatorProxy = React.createClass({
  render() {
    return React.cloneElement(this.props.children,
      { ...this.props.children.props, myProp: true });
  },
});

const MarkupProxy = React.createClass({
  render() {
    return React.createElement('div', {
      className: 'markupProxy',
      children: [React.createElement('span',
        { ref: 'textSpan', children: 'Add some text near component' }),
        this.props.children,
      ],
    });
  },
});

module.exports = { ...selectedFixture,
  proxies: [PropMutatorProxy, MarkupProxy],
};
