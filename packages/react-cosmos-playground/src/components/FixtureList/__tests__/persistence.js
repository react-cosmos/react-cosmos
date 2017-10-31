import { getSavedExpansionState, updateLocalToggleState } from '../persistence';
import localForage from 'localforage';
import { TREE_EXPANSION_STATE } from '../persistence';
jest.mock('localforage');

test('getSavedExpansionState', async () => {
  const projectKey = 'test';
  localForage.__setItemMocks({
    [`${TREE_EXPANSION_STATE}-${projectKey}`]: { '/path': true }
  });
  const savedExpansionState = await getSavedExpansionState(projectKey);
  expect(savedExpansionState).toEqual({ '/path': true });
});

test('updateLocalToggleState', async () => {
  const projectKey = 'test';
  await updateLocalToggleState(projectKey, '/path', false);
  const savedExpansionState = await getSavedExpansionState(projectKey);
  expect(savedExpansionState).toEqual({ '/path': false });
});
