import { APIRequestContext, Page, expect, test } from '@playwright/test';
import { CosmosFixtureJson, CosmosFixturesJson } from 'react-cosmos';
import { FixtureId, createRendererUrl } from 'react-cosmos-core';
import { webTests } from './helpers/webTests.js';

const url = 'http://localhost:5000';

test.describe('DOM dev', () => {
  webTests(url);
});
