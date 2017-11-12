// @flow

import { readFileSync, writeFileSync } from 'fs';
import upgradeFixtures from '../upgrade-fixtures';
import { addComponentToFixture } from '../transforms/add-component-to-fixture';

jest.mock('react-cosmos-config', () => ({
  hasCosmosConfig: () => true,
  getCosmosConfig: jest.fn(() => ({
    componentPaths: ['foo']
  }))
}));

const mockComponents = {
  'ill/shared/emoji-block': '/path/to/components/ill/shared/emoji-block.js',
  'ill/shared/emoji-icon': '/path/to/components/ill/shared/emoji-icon.js'
};
const mockFixtures = {
  'ill/shared/emoji-block': {
    glow: '/path/to/components/__fixtures__/ill/shared/emoji-block/glow.js'
  },
  'ill/shared/emoji-icon': {
    bear: '/path/to/components/__fixtures__/ill/shared/emoji-icon/bear.js',
    panda: '/path/to/components/__fixtures__/ill/shared/emoji-icon/panda.js'
  }
};
jest.mock('react-cosmos-voyager', () => () => ({
  components: mockComponents,
  fixtures: mockFixtures
}));

const mockFiles = {
  '/path/to/components/__fixtures__/ill/shared/emoji-block/glow.js': 'MOCK_I1',
  '/path/to/components/__fixtures__/ill/shared/emoji-icon/bear.js': 'MOCK_I2',
  '/path/to/components/__fixtures__/ill/shared/emoji-icon/panda.js': 'MOCK_I3'
};

jest.mock('fs', () => ({
  readFileSync: jest.fn(p => mockFiles[p]),
  writeFileSync: jest.fn()
}));

const mockOutput = {
  MOCK_I1: 'MOCK_O1',
  MOCK_I2: 'MOCK_O2',
  MOCK_I3: 'MOCK_O3'
};

jest.mock('../transforms/add-component-to-fixture', () => ({
  addComponentToFixture: jest.fn(({ fixtureCode }) => mockOutput[fixtureCode])
}));

beforeEach(() => {
  upgradeFixtures();
});

describe('first file', () => {
  it('reads it', () => {
    expect(readFileSync).toHaveBeenCalledWith(
      '/path/to/components/__fixtures__/ill/shared/emoji-block/glow.js',
      'utf8'
    );
  });

  it('transforms it', () => {
    expect(addComponentToFixture).toHaveBeenCalledWith({
      fixtureCode: 'MOCK_I1',
      componentPath: '../../../../ill/shared/emoji-block.js',
      componentName: 'EmojiBlock'
    });
  });

  it('writes it', () => {
    expect(writeFileSync).toHaveBeenCalledWith(
      '/path/to/components/__fixtures__/ill/shared/emoji-block/glow.js',
      'MOCK_O1',
      'utf8'
    );
  });
});

describe('second file', () => {
  it('reads it', () => {
    expect(readFileSync).toHaveBeenCalledWith(
      '/path/to/components/__fixtures__/ill/shared/emoji-icon/bear.js',
      'utf8'
    );
  });

  it('transforms it', () => {
    expect(addComponentToFixture).toHaveBeenCalledWith({
      fixtureCode: 'MOCK_I2',
      componentPath: '../../../../ill/shared/emoji-icon.js',
      componentName: 'EmojiIcon'
    });
  });

  it('writes it', () => {
    expect(writeFileSync).toHaveBeenCalledWith(
      '/path/to/components/__fixtures__/ill/shared/emoji-icon/bear.js',
      'MOCK_O2',
      'utf8'
    );
  });
});

describe('third file', () => {
  it('reads it', () => {
    expect(readFileSync).toHaveBeenCalledWith(
      '/path/to/components/__fixtures__/ill/shared/emoji-icon/panda.js',
      'utf8'
    );
  });

  it('transforms it', () => {
    expect(addComponentToFixture).toHaveBeenCalledWith({
      fixtureCode: 'MOCK_I3',
      componentPath: '../../../../ill/shared/emoji-icon.js',
      componentName: 'EmojiIcon'
    });
  });

  it('writes it', () => {
    expect(writeFileSync).toHaveBeenCalledWith(
      '/path/to/components/__fixtures__/ill/shared/emoji-icon/panda.js',
      'MOCK_O3',
      'utf8'
    );
  });
});
