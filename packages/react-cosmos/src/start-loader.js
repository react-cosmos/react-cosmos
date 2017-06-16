import ReactDOM from 'react-dom';
import createLoaderElement from './create-loader-element';

let domContainer;

const createDomContainer = () => {
  if (!domContainer) {
    domContainer = document.createElement('div');
    Object.assign(domContainer.style, {
      position: 'absolute',
      width: '100%',
      height: '100%',
    });
    document.body.appendChild(domContainer);
  }

  return domContainer;
};

export default ({
  proxies,
  components,
  fixtures,
  containerQuerySelector,
}) => {
  const container =
    containerQuerySelector ?
    document.querySelector(containerQuerySelector) :
    createDomContainer();

  ReactDOM.render(
    createLoaderElement({
      proxies,
      components,
      fixtures,
    }),
    container,
  );
};
