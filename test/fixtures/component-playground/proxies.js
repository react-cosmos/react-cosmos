/* eslint-disable
  react/prefer-es6-class,
  react/prefer-stateless-function,
  react/no-multi-comp,
  react/prop-types,
  react/jsx-filename-extension,
  react/no-string-refs
*/

import React from 'react';
import selectedFixture from './selected-fixture.js';

const PropMutatorProxy = (props) => {
  const {
    nextProxy,
    fixture,
  } = props;

  return React.createElement(nextProxy.value, {
    ...props,
    nextProxy: nextProxy.next(),
    fixture: {
      ...fixture,
      myProp: true,
    },
  });
};

class MarkupProxy extends React.Component {
  render() {
    const {
      nextProxy,
      fixture,
    } = this.props;

    return (
      <div className="markupProxy">
        <span ref="textSpan">Add some text near component</span>
        {React.createElement(nextProxy.value, {
          ...this.props,
          nextProxy: nextProxy.next(),
        })}
      </div>
    );
  }
}

const PreviewLoader = ({
  fixture,
  onPreviewRef,
}) => React.createElement(fixture.component, {
  ...fixture,
  ref: onPreviewRef,
});

module.exports = { ...selectedFixture,
  firstProxy: {
    value: PropMutatorProxy,
    next: () => ({
      value: MarkupProxy,
      next: () => ({
        value: PreviewLoader,
        next: () => {},
      }),
    }),
  },
};
