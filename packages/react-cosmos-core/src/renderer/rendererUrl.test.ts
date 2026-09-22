import { createRendererUrl, decodeRendererUrlFixture } from './rendererUrl.js';

const fixtureId = { path: '/path/to/fixture.js', name: 'first' };

describe('static renderer URL', () => {
  describe('root host path', () => {
    const rendererUrl = 'http://localhost:5000';

    it('index', () => {
      expect(createRendererUrl(rendererUrl)).toEqual('http://localhost:5000');
    });

    it('index detached', () => {
      expect(createRendererUrl(rendererUrl, { detached: true })).toEqual(
        'http://localhost:5000/?detached=true'
      );
    });

    it('fixture', () => {
      expect(createRendererUrl(rendererUrl, { fixtureId })).toEqual(
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22%2Fpath%2Fto%2Ffixture.js%22%2C%22name%22%3A%22first%22%7D'
      );
    });

    it('fixture locked', () => {
      expect(
        createRendererUrl(rendererUrl, { fixtureId, locked: true })
      ).toEqual(
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22%2Fpath%2Fto%2Ffixture.js%22%2C%22name%22%3A%22first%22%7D&locked=true'
      );
    });

    it('fixture detached', () => {
      expect(
        createRendererUrl(rendererUrl, { fixtureId, detached: true })
      ).toEqual(
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22%2Fpath%2Fto%2Ffixture.js%22%2C%22name%22%3A%22first%22%7D&detached=true'
      );
    });
  });

  describe('nested host path', () => {
    const rendererUrl = 'http://localhost:5000/renderer.html';

    it('index', () => {
      expect(createRendererUrl(rendererUrl)).toEqual(
        'http://localhost:5000/renderer.html'
      );
    });

    it('index detached', () => {
      expect(createRendererUrl(rendererUrl, { detached: true })).toEqual(
        'http://localhost:5000/renderer.html?detached=true'
      );
    });

    it('fixture', () => {
      expect(createRendererUrl(rendererUrl, { fixtureId })).toEqual(
        'http://localhost:5000/renderer.html?fixtureId=%7B%22path%22%3A%22%2Fpath%2Fto%2Ffixture.js%22%2C%22name%22%3A%22first%22%7D'
      );
    });

    it('fixture locked', () => {
      expect(
        createRendererUrl(rendererUrl, { fixtureId, locked: true })
      ).toEqual(
        'http://localhost:5000/renderer.html?fixtureId=%7B%22path%22%3A%22%2Fpath%2Fto%2Ffixture.js%22%2C%22name%22%3A%22first%22%7D&locked=true'
      );
    });

    it('fixture detached', () => {
      expect(
        createRendererUrl(rendererUrl, { fixtureId, detached: true })
      ).toEqual(
        'http://localhost:5000/renderer.html?fixtureId=%7B%22path%22%3A%22%2Fpath%2Fto%2Ffixture.js%22%2C%22name%22%3A%22first%22%7D&detached=true'
      );
    });
  });

  describe('relative path', () => {
    const rendererUrl = 'renderer.html';

    it('index', () => {
      expect(createRendererUrl(rendererUrl)).toEqual('renderer.html');
    });

    it('index detached', () => {
      expect(createRendererUrl(rendererUrl, { detached: true })).toEqual(
        'renderer.html?detached=true'
      );
    });

    it('fixture', () => {
      expect(createRendererUrl(rendererUrl, { fixtureId })).toEqual(
        'renderer.html?fixtureId=%7B%22path%22%3A%22%2Fpath%2Fto%2Ffixture.js%22%2C%22name%22%3A%22first%22%7D'
      );
    });

    it('fixture locked', () => {
      expect(
        createRendererUrl(rendererUrl, { fixtureId, locked: true })
      ).toEqual(
        'renderer.html?fixtureId=%7B%22path%22%3A%22%2Fpath%2Fto%2Ffixture.js%22%2C%22name%22%3A%22first%22%7D&locked=true'
      );
    });

    it('fixture detached', () => {
      expect(
        createRendererUrl(rendererUrl, { fixtureId, detached: true })
      ).toEqual(
        'renderer.html?fixtureId=%7B%22path%22%3A%22%2Fpath%2Fto%2Ffixture.js%22%2C%22name%22%3A%22first%22%7D&detached=true'
      );
    });
  });

  describe('root path', () => {
    const rendererUrl = '/renderer.html';

    it('index', () => {
      expect(createRendererUrl(rendererUrl)).toEqual('/renderer.html');
    });

    it('index detached', () => {
      expect(createRendererUrl(rendererUrl, { detached: true })).toEqual(
        '/renderer.html?detached=true'
      );
    });

    it('fixture', () => {
      expect(createRendererUrl(rendererUrl, { fixtureId })).toEqual(
        '/renderer.html?fixtureId=%7B%22path%22%3A%22%2Fpath%2Fto%2Ffixture.js%22%2C%22name%22%3A%22first%22%7D'
      );
    });

    it('fixture locked', () => {
      expect(
        createRendererUrl(rendererUrl, { fixtureId, locked: true })
      ).toEqual(
        '/renderer.html?fixtureId=%7B%22path%22%3A%22%2Fpath%2Fto%2Ffixture.js%22%2C%22name%22%3A%22first%22%7D&locked=true'
      );
    });

    it('fixture detached', () => {
      expect(
        createRendererUrl(rendererUrl, { fixtureId, detached: true })
      ).toEqual(
        '/renderer.html?fixtureId=%7B%22path%22%3A%22%2Fpath%2Fto%2Ffixture.js%22%2C%22name%22%3A%22first%22%7D&detached=true'
      );
    });
  });

  describe('root nested path', () => {
    const rendererUrl = '/cosmos/renderer.html';

    it('index', () => {
      expect(createRendererUrl(rendererUrl)).toEqual('/cosmos/renderer.html');
    });

    it('index detached', () => {
      expect(createRendererUrl(rendererUrl, { detached: true })).toEqual(
        '/cosmos/renderer.html?detached=true'
      );
    });

    it('fixture', () => {
      expect(createRendererUrl(rendererUrl, { fixtureId })).toEqual(
        '/cosmos/renderer.html?fixtureId=%7B%22path%22%3A%22%2Fpath%2Fto%2Ffixture.js%22%2C%22name%22%3A%22first%22%7D'
      );
    });

    it('fixture locked', () => {
      expect(
        createRendererUrl(rendererUrl, { fixtureId, locked: true })
      ).toEqual(
        '/cosmos/renderer.html?fixtureId=%7B%22path%22%3A%22%2Fpath%2Fto%2Ffixture.js%22%2C%22name%22%3A%22first%22%7D&locked=true'
      );
    });

    it('fixture detached', () => {
      expect(
        createRendererUrl(rendererUrl, { fixtureId, detached: true })
      ).toEqual(
        '/cosmos/renderer.html?fixtureId=%7B%22path%22%3A%22%2Fpath%2Fto%2Ffixture.js%22%2C%22name%22%3A%22first%22%7D&detached=true'
      );
    });
  });
});

describe('dynamic renderer URL', () => {
  describe('root host path', () => {
    const rendererUrl = 'http://localhost:5000/<fixture>';

    it('index', () => {
      expect(createRendererUrl(rendererUrl)).toEqual(
        'http://localhost:5000/index'
      );
    });

    it('index detached', () => {
      expect(createRendererUrl(rendererUrl, { detached: true })).toEqual(
        'http://localhost:5000/index?detached=true'
      );
    });

    it('fixture', () => {
      expect(createRendererUrl(rendererUrl, { fixtureId })).toEqual(
        'http://localhost:5000/eyJwYXRoIjoiL3BhdGgvdG8vZml4dHVyZS5qcyIsIm5hbWUiOiJmaXJzdCJ9'
      );
    });

    it('fixture locked', () => {
      expect(
        createRendererUrl(rendererUrl, { fixtureId, locked: true })
      ).toEqual(
        'http://localhost:5000/eyJwYXRoIjoiL3BhdGgvdG8vZml4dHVyZS5qcyIsIm5hbWUiOiJmaXJzdCJ9?locked=true'
      );
    });

    it('fixture detached', () => {
      expect(
        createRendererUrl(rendererUrl, { fixtureId, detached: true })
      ).toEqual(
        'http://localhost:5000/eyJwYXRoIjoiL3BhdGgvdG8vZml4dHVyZS5qcyIsIm5hbWUiOiJmaXJzdCJ9?detached=true'
      );
    });
  });

  describe('nested host path', () => {
    const rendererUrl = 'http://localhost:5000/cosmos/<fixture>';

    it('index', () => {
      expect(createRendererUrl(rendererUrl)).toEqual(
        'http://localhost:5000/cosmos/index'
      );
    });

    it('index detached', () => {
      expect(createRendererUrl(rendererUrl, { detached: true })).toEqual(
        'http://localhost:5000/cosmos/index?detached=true'
      );
    });

    it('fixture', () => {
      expect(createRendererUrl(rendererUrl, { fixtureId })).toEqual(
        'http://localhost:5000/cosmos/eyJwYXRoIjoiL3BhdGgvdG8vZml4dHVyZS5qcyIsIm5hbWUiOiJmaXJzdCJ9'
      );
    });

    it('fixture locked', () => {
      expect(
        createRendererUrl(rendererUrl, { fixtureId, locked: true })
      ).toEqual(
        'http://localhost:5000/cosmos/eyJwYXRoIjoiL3BhdGgvdG8vZml4dHVyZS5qcyIsIm5hbWUiOiJmaXJzdCJ9?locked=true'
      );
    });

    it('fixture detached', () => {
      expect(
        createRendererUrl(rendererUrl, { fixtureId, detached: true })
      ).toEqual(
        'http://localhost:5000/cosmos/eyJwYXRoIjoiL3BhdGgvdG8vZml4dHVyZS5qcyIsIm5hbWUiOiJmaXJzdCJ9?detached=true'
      );
    });
  });

  describe('root path', () => {
    const rendererUrl = '/<fixture>';

    it('index', () => {
      expect(createRendererUrl(rendererUrl)).toEqual('/index');
    });

    it('index detached', () => {
      expect(createRendererUrl(rendererUrl, { detached: true })).toEqual(
        '/index?detached=true'
      );
    });

    it('fixture', () => {
      expect(createRendererUrl(rendererUrl, { fixtureId })).toEqual(
        '/eyJwYXRoIjoiL3BhdGgvdG8vZml4dHVyZS5qcyIsIm5hbWUiOiJmaXJzdCJ9'
      );
    });

    it('fixture locked', () => {
      expect(
        createRendererUrl(rendererUrl, { fixtureId, locked: true })
      ).toEqual(
        '/eyJwYXRoIjoiL3BhdGgvdG8vZml4dHVyZS5qcyIsIm5hbWUiOiJmaXJzdCJ9?locked=true'
      );
    });

    it('fixture detached', () => {
      expect(
        createRendererUrl(rendererUrl, { fixtureId, detached: true })
      ).toEqual(
        '/eyJwYXRoIjoiL3BhdGgvdG8vZml4dHVyZS5qcyIsIm5hbWUiOiJmaXJzdCJ9?detached=true'
      );
    });
  });

  describe('root nested path', () => {
    const rendererUrl = '/cosmos/<fixture>';

    it('index', () => {
      expect(createRendererUrl(rendererUrl)).toEqual('/cosmos/index');
    });

    it('index detached', () => {
      expect(createRendererUrl(rendererUrl, { detached: true })).toEqual(
        '/cosmos/index?detached=true'
      );
    });

    it('fixture', () => {
      expect(createRendererUrl(rendererUrl, { fixtureId })).toEqual(
        '/cosmos/eyJwYXRoIjoiL3BhdGgvdG8vZml4dHVyZS5qcyIsIm5hbWUiOiJmaXJzdCJ9'
      );
    });

    it('fixture locked', () => {
      expect(
        createRendererUrl(rendererUrl, { fixtureId, locked: true })
      ).toEqual(
        '/cosmos/eyJwYXRoIjoiL3BhdGgvdG8vZml4dHVyZS5qcyIsIm5hbWUiOiJmaXJzdCJ9?locked=true'
      );
    });

    it('fixture detached', () => {
      expect(
        createRendererUrl(rendererUrl, { fixtureId, detached: true })
      ).toEqual(
        '/cosmos/eyJwYXRoIjoiL3BhdGgvdG8vZml4dHVyZS5qcyIsIm5hbWUiOiJmaXJzdCJ9?detached=true'
      );
    });
  });
});

it('decodes renderer URL fixture', () => {
  expect(
    decodeRendererUrlFixture(
      'eyJwYXRoIjoiL3BhdGgvdG8vZml4dHVyZS5qcyIsIm5hbWUiOiJmaXJzdCJ9'
    )
  ).toEqual(fixtureId);
});
