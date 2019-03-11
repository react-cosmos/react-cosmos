const CONTAINER_ID = 'root';

export function getDomContainer() {
  return document.getElementById(CONTAINER_ID) || createDomContainer();
}

function createDomContainer() {
  const { body } = document;

  if (!body) {
    throw new Error(
      `Can't create DOM container because document.body is missing`
    );
  }

  const container = document.createElement('div');
  container.setAttribute('id', CONTAINER_ID);

  body.appendChild(container);

  return container;
}
