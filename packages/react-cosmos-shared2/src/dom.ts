export function getDomContainer(querySelector?: string) {
  if (!querySelector) {
    return getFallbackDomContainer();
  }

  const existingContainer = document.querySelector(querySelector);
  if (!existingContainer) {
    // TODO: Move this function outside of the shared package. It contains
    // renderer-specific knowledge. Keep createDomContainer to reuse in
    // the playground package.
    console.warn(
      `Query selector "${querySelector}" doesn't match any existing DOM element. ` +
        `Are you using a custom HTML template? ` +
        `Add an element matching "${querySelector}" to your template or change the containerQuerySelector setting.`
    );
    return getFallbackDomContainer();
  }

  return existingContainer;
}

function getFallbackDomContainer() {
  return document.querySelector('#root') || createDomContainer();
}

function createDomContainer() {
  const { body } = document;
  if (!body) {
    throw new Error(
      `Can't create DOM container because document.body is missing`
    );
  }

  const container = document.createElement('div');
  container.setAttribute('id', 'root');
  body.appendChild(container);

  return container;
}
