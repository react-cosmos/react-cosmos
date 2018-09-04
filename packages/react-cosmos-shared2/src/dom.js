/* eslint-env browser */
// @flow

let container;

export function getDomContainer() {
  if (!container) {
    createDomContainer();
  }

  return container;
}

function createDomContainer() {
  const { body } = document;

  if (!body) {
    throw new Error(
      `Can't create DOM container because document.body is missing`
    );
  }

  container = document.createElement('div');
  body.appendChild(container);
}
