import { Router } from 'react-querystring-router';
import ReactComponentPlayground from 'react-component-playground';
import { loadFixtures } from './load-modules';

const getTitleForFixture = (params) => {
  const { component, fixture } = params;
  const title = 'React Cosmos';

  // Set document title to the name of the selected fixture
  if (component && fixture) {
    return `${component}:${fixture} – ${title}`;
  }

  return title;
};

module.exports = ({
  fixtures,
  loaderUri,
}) =>
  new Router({
    container: document.body.appendChild(document.createElement('div')),
    getComponentClass: () => ReactComponentPlayground,
    getComponentProps: params => ({
      ...params,
      fixtures: loadFixtures(fixtures),
      loaderUri,
    }),
    onChange: (params) => {
      document.title = getTitleForFixture(params);
    },
  });
