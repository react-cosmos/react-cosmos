import { Router } from 'react-querystring-router';
import ReactComponentPlayground from 'react-component-playground';
import { loadFixtures } from './load-modules';

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
}) {
  return new Router({
    container: createDomContainer(),
    getComponentClass: () => ReactComponentPlayground,
    getComponentProps: params => ({
      ...params,
      fixtures: loadFixtures(fixtures),
      loaderUri,
    }),
    onChange: params => {
      document.title = getTitleForFixture(params);
    },
  });
}
