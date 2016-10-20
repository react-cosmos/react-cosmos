import ReactQuerystringRouter from 'react-querystring-router';
import ComponentPlayground from 'react-component-playground';
import { loadComponents, loadFixtures } from './load-modules';
import createLinkedList from './linked-list';
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
}) => {
  const firstProxy = createLinkedList([
    ...proxies,
    // Loaded by default in all configs
    createStateProxy(),
    // The final proxy in the chain simply renders the preview component
    PreviewLoader,
  ]);

  return new ReactQuerystringRouter.Router({
    container: document.body.appendChild(document.createElement('div')),
    defaultProps: {
      firstProxy,
      components: loadComponents(components),
      fixtures: loadFixtures(fixtures),
    },
    getComponentClass: () => ComponentPlayground,
    onChange: (params) => {
      document.title = getTitleForFixture(params);
    },
  });
};
