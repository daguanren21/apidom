import path from 'node:path';
import { assert } from 'chai';
import { mediaTypes } from '@swagger-api/apidom-ns-openapi-3-1';
import { fileURLToPath } from 'node:url';

import { resolve } from '../../../../../src/index.ts';
import MaximumDereferenceDepthError from '../../../../../src/errors/MaximumDereferenceDepthError.ts';
import MaximumResolveDepthError from '../../../../../src/errors/MaximumResolveDepthError.ts';
import ResolverError from '../../../../../src/errors/ResolverError.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootFixturePath = path.join(__dirname, 'fixtures');

describe('resolve', function () {
  context('strategies', function () {
    context('openapi-3-1', function () {
      context('Reference Object', function () {
        context('given Reference Objects pointing internally and externally', function () {
          const fixturePath = path.join(rootFixturePath, 'internal-external');

          specify('should resolve', async function () {
            const rootFilePath = path.join(fixturePath, 'root.json');
            const refSet = await resolve(rootFilePath, {
              parse: { mediaType: mediaTypes.latest('json') },
            });

            assert.strictEqual(refSet.size, 2);
          });
        });

        context('given Reference Objects pointing internally only', function () {
          const fixturePath = path.join(rootFixturePath, 'internal-only');

          specify('should resolve', async function () {
            const rootFilePath = path.join(fixturePath, 'root.json');
            const refSet = await resolve(rootFilePath, {
              parse: { mediaType: mediaTypes.latest('json') },
            });

            assert.strictEqual(refSet.size, 1);
          });
        });

        context('given Reference Objects pointing externally only', function () {
          const fixturePath = path.join(rootFixturePath, 'external-only');

          specify('should resolve', async function () {
            const rootFilePath = path.join(fixturePath, 'root.json');
            const refSet = await resolve(rootFilePath, {
              parse: { mediaType: mediaTypes.latest('json') },
            });

            assert.strictEqual(refSet.size, 2);
          });
        });

        context('given Reference Objects pointing to external indirections', function () {
          const fixturePath = path.join(rootFixturePath, 'external-indirections');

          specify('should resolve', async function () {
            const rootFilePath = path.join(fixturePath, 'root.json');
            const refSet = await resolve(rootFilePath, {
              parse: { mediaType: mediaTypes.latest('json') },
            });

            assert.strictEqual(refSet.size, 4);
          });
        });

        context('given Reference Objects with external circular dependency', function () {
          const fixturePath = path.join(rootFixturePath, 'external-circular-dependency');

          specify('should resolve', async function () {
            const rootFilePath = path.join(fixturePath, 'root.json');
            const refSet = await resolve(rootFilePath, {
              parse: { mediaType: mediaTypes.latest('json') },
            });

            assert.strictEqual(refSet.size, 2);
          });
        });

        context('given Reference Objects with external resolution disabled', function () {
          const fixturePath = path.join(rootFixturePath, 'ignore-external');

          specify('should not resolve', async function () {
            const rootFilePath = path.join(fixturePath, 'root.json');
            const refSet = await resolve(rootFilePath, {
              parse: { mediaType: mediaTypes.latest('json') },
              resolve: { external: false },
            });

            assert.strictEqual(refSet.size, 1);
          });
        });

        context('given Reference Objects with direct circular internal reference', function () {
          const fixturePath = path.join(rootFixturePath, 'direct-internal-circular');

          specify('should throw error', async function () {
            const rootFilePath = path.join(fixturePath, 'root.json');
            try {
              await resolve(rootFilePath, {
                parse: { mediaType: mediaTypes.latest('json') },
              });
            } catch (e) {
              assert.instanceOf(e, ResolverError);
            }
          });
        });

        context('given Reference Objects with indirect circular internal reference', function () {
          const fixturePath = path.join(rootFixturePath, 'indirect-internal-circular');

          specify('should throw error', async function () {
            const rootFilePath = path.join(fixturePath, 'root.json');
            try {
              await resolve(rootFilePath, {
                parse: { mediaType: mediaTypes.latest('json') },
              });
            } catch (e) {
              assert.instanceOf(e, ResolverError);
            }
          });
        });

        context('given Reference Objects with direct circular external reference', function () {
          const fixturePath = path.join(rootFixturePath, 'direct-external-circular');

          specify('should throw error', async function () {
            const rootFilePath = path.join(fixturePath, 'root.json');
            try {
              await resolve(rootFilePath, {
                parse: { mediaType: mediaTypes.latest('json') },
              });
            } catch (e) {
              assert.instanceOf(e, ResolverError);
            }
          });
        });

        context('given Reference Objects with indirect circular external reference', function () {
          const fixturePath = path.join(rootFixturePath, 'indirect-external-circular');

          specify('should throw error', async function () {
            const rootFilePath = path.join(fixturePath, 'root.json');
            try {
              await resolve(rootFilePath, {
                parse: { mediaType: mediaTypes.latest('json') },
              });
            } catch (e) {
              assert.instanceOf(e, ResolverError);
            }
          });
        });

        context('given Reference Objects with unresolvable reference', function () {
          const fixturePath = path.join(rootFixturePath, 'unresolvable-reference');

          specify('should throw error', async function () {
            const rootFilePath = path.join(fixturePath, 'root.json');
            try {
              await resolve(rootFilePath, {
                parse: { mediaType: mediaTypes.latest('json') },
              });
            } catch (e) {
              assert.instanceOf(e, ResolverError);
            }
          });
        });

        context('given Reference Objects with invalid JSON Pointer', function () {
          const fixturePath = path.join(rootFixturePath, 'invalid-pointer');

          specify('should throw error', async function () {
            const rootFilePath = path.join(fixturePath, 'root.json');
            try {
              await resolve(rootFilePath, {
                parse: { mediaType: mediaTypes.latest('json') },
              });
            } catch (e) {
              assert.instanceOf(e, ResolverError);
            }
          });
        });

        context('given Reference Objects with arbitrary circular references', function () {
          const fixturePath = path.join(rootFixturePath, 'ignore-arbitrary-$refs');

          specify('should resolve', async function () {
            const rootFilePath = path.join(fixturePath, 'root.json');
            const refSet = await resolve(rootFilePath, {
              parse: { mediaType: mediaTypes.latest('json') },
            });

            assert.strictEqual(refSet.size, 2);
          });
        });

        context('given Reference Objects and maxDepth of dereference', function () {
          const fixturePath = path.join(rootFixturePath, 'max-depth');

          specify('should throw error', async function () {
            const rootFilePath = path.join(fixturePath, 'root.json');

            try {
              await resolve(rootFilePath, {
                parse: { mediaType: mediaTypes.latest('json') },
                dereference: { maxDepth: 2 },
              });
              assert.fail('should throw MaximumDereferenceDepthError');
            } catch (error: any) {
              assert.instanceOf(error, ResolverError);
              // @ts-ignore
              assert.instanceOf(error.cause.cause, MaximumDereferenceDepthError);
              // @ts-ignore
              assert.match(error.cause.cause.message, /fixtures\/max-depth\/ex2.json"$/);
            }
          });
        });

        context('given Reference Objects and maxDepth of resolution', function () {
          const fixturePath = path.join(rootFixturePath, 'max-depth');

          specify('should throw error', async function () {
            const rootFilePath = path.join(fixturePath, 'root.json');

            try {
              await resolve(rootFilePath, {
                parse: { mediaType: mediaTypes.latest('json') },
                resolve: { maxDepth: 2 },
              });
              assert.fail('should throw MaximumResolveDepthError');
            } catch (error: any) {
              assert.instanceOf(error, ResolverError);
              // @ts-ignore
              assert.instanceOf(error.cause.cause, MaximumResolveDepthError);
              // @ts-ignore
              assert.match(error.cause.cause.message, /fixtures\/max-depth\/ex2.json"$/);
            }
          });
        });
      });
    });
  });
});
