import { loadFixtures } from './load-modules';
import { Router } from 'react-querystring-router';
import ReactComponentPlayground from 'react-component-playground';

const getTitleForFixture = params => {
  const { component, fixture } = params;
  const title = 'React Cosmos';

  // Set document title to the name of the selected fixture
  if (component && fixture) {
    return `${component}:${fixture} – ${title}`;
  }

  return title;
};

let domContainer;

const createDomContainer = () => {
  if (!domContainer) {
    domContainer = document.createElement('div');
    document.body.appendChild(domContainer);
  }
  return domContainer;
};

export default function startPlayground({
  fixtures,
  loaderUri,
  userSource
}) {
  return new Router({
    container: createDomContainer(),
    getComponentClass: () => ReactComponentPlayground,
    getComponentProps: params => ({
      ...params,
      fixtures: loadFixtures(fixtures),
      loaderUri,
      userSource
    }),
    onChange: params => {
      document.title = getTitleForFixture(params);
    },
  });
}
