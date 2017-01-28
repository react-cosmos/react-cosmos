module.exports = React => {
  const version = parseFloat(React.version);

  if (version >= 0.14) {
    // Let bundlers (e.g. webpack) know react-dom won't always be there
    try {
      // eslint-disable-next-line import/no-extraneous-dependencies
      return require('react-dom');
    } catch (err) {
      return null;
    }
  } else {
    const { render, unmountComponentAtNode } = React;
    return {
      findDOMNode: reactElement => (
        typeof reactElement.getDOMNode === 'function' ?
          reactElement.getDOMNode() : reactElement
      ),
      render,
      unmountComponentAtNode,
    };
  }
};
