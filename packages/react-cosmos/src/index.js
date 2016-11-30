import ReactQuerystringRouter from 'react-querystring-router';
import ComponentPlayground from 'react-component-playground';
import createLinkedList from 'react-cosmos-utils/lib/linked-list';
import { loadComponents, loadFixtures } from './load-modules';
import PreviewLoader from './proxies/PreviewLoader';
import createStateProxy from './proxies/StateProxy';

const getTitleForFixture = (params) => {
  let title = 'React Cosmos';

  // Set document title to the name of the selected fixture
  if (params.component && params.fixture) {
    title = `${params.component}:${params.fixture} – ${title}`;
  }

  return title;
};

module.exports = ({
  proxies,
  components,
  fixtures,
  containerQuerySelector,
  containerClassName,
}) => {
  const firstProxy = createLinkedList([
    ...proxies,
    // Loaded by default in all configs
    createStateProxy(),
    // The final proxy in the chain simply renders the preview component
    PreviewLoader,
  ]);

  const container = containerQuerySelector ?
    document.querySelector(containerQuerySelector) :
    document.body.appendChild(document.createElement('div'));

  return new ReactQuerystringRouter.Router({
    container,
    defaultProps: {
      firstProxy,
      components: loadComponents(components),
      fixtures: loadFixtures(fixtures),
      containerClassName,
    },
    getComponentClass: () => ComponentPlayground,
    onChange: (params) => {
      document.title = getTitleForFixture(params);
    },
  });
};
