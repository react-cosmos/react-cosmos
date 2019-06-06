import React from 'react';
import { loadPlugins, ArraySlot } from 'react-plugin';
import { render, fireEvent } from 'react-testing-library';
import { register } from '.';
import { cleanup } from '../../testHelpers/plugin';
import { mockCore, mockRouter } from '../../testHelpers/pluginMocks';
import { mockFetch } from './testHelpers';

afterEach(cleanup);

function mockSelectedFixtureId() {
  mockRouter({
    getSelectedFixtureId: () => ({ path: 'foo.js', name: null })
  });
}

async function loadTestPlugins() {
  loadPlugins();
  return render(<ArraySlot name="fixtureActions" />);
}

it(`doesn't render button when dev server is off`, async () => {
  register();
  mockSelectedFixtureId();
  mockCore({
    isDevServerOn: () => false
  });

  const { queryByTitle } = await loadTestPlugins();
  expect(queryByTitle(/open fixture source/i)).toBeNull();
});

it('renders button', async () => {
  register();
  mockSelectedFixtureId();
  mockCore({
    isDevServerOn: () => true
  });

  const { getByTitle } = await loadTestPlugins();
  getByTitle(/open fixture source/i);
});

it('calls server endpoint on button click', async () => {
  await mockFetch(async fetchMock => {
    register();
    mockSelectedFixtureId();
    mockCore({
      isDevServerOn: () => true
    });

    const { getByTitle } = await loadTestPlugins();
    const editBtn = getByTitle(/open fixture source/i);
    fireEvent.click(editBtn);

    const openFileUrl = '/_open?filePath=foo.js';
    expect(fetchMock).toBeCalledWith(openFileUrl, expect.any(Object));
  });
});
