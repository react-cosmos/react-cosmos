import { getSavedExpansionState, updateLocalToggleState } from '../persistence';

jest.mock('localforage');

test('initial state, setting state, getting state', async () => {
  const projectKey = 'test';

  const initialState = await getSavedExpansionState(projectKey);
  expect(initialState).toEqual({});

  await updateLocalToggleState(projectKey, '/path', false);
  const savedExpansionState = await getSavedExpansionState(projectKey);
  expect(savedExpansionState).toEqual({ '/path': false });

  await updateLocalToggleState(projectKey, '/path', true);
  const updatedExpansionState = await getSavedExpansionState(projectKey);
  expect(updatedExpansionState).toEqual({ '/path': true });
});
