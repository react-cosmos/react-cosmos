module.exports = {
  env: {
    browser: true,
    mocha: true,
  },
  rules: {
    // Allow require-ing inside describe cases
    "global-require": "off",
    // For some reason this confuses ESLint:
    //  ({ container, component, $component } = render(fixture));
    "no-unused-vars": "off",
    // Allow chai assertions like:
    //   expect(component.render).to.not.have.been.called;
    "no-unused-expressions": "off",
    // Allow magical module paths resolved by webpack (both rules). E.g.
    //   require('helpers/render-component')
    "import/no-unresolved": "off",
    "import/no-extraneous-dependencies": "off",
    // For the moment Cosmos is using findDOMNode()
    "react/no-find-dom-node": "off",
  },
  globals: {
    expect: true,
    sinon: true,
  }
};
