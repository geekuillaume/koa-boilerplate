import { testApi } from '../lib/testApi';
import { prepareTestDb } from '../lib/testsHelpers';
import { rollbackGlobalTransaction } from '../lib/requestContext';

describe('Healthcheck', () => {
  beforeAll(prepareTestDb);
  afterEach(rollbackGlobalTransaction);

  it('should respond with 200 for a basic healthcheck on /healthz', async () => {
    await testApi()
      .get('/healthz')
      .expect(200);
  });

  it('should respond with 405 when requesting POST /healthz', async () => {
    await testApi()
      .post('/healthz')
      .expect(405);
  });
});
