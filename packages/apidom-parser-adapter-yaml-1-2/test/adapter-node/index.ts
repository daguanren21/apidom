import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { assert, expect } from 'chai';
import { YamlTagError } from '@swagger-api/apidom-ast';
import {
  toValue,
  isObjectElement,
  isParseResultElement,
  sexprs,
  isStringElement,
} from '@swagger-api/apidom-core';

import * as adapter from '../../src/adapter-node.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const spec = fs.readFileSync(path.join(__dirname, '..', 'fixtures', 'sample-data.yaml')).toString();

describe('adapter-node', function () {
  context('given valid YAML 1.2', function () {
    specify('should detect proper media type', async function () {
      assert.isTrue(await adapter.detect(spec));
    });
  });

  context('given non YAML 1.2', function () {
    specify('should detect proper media type', async function () {
      assert.isFalse(
        await adapter.detect(`
      !!Invalid yaml:
         "some: key" :
        - "no quotes here: value"
        - list without separator
        another_key: "value" other_key: value
      [no_key]
      :another_invalid_struct!
      `),
      );
    });
  });

  context('given invalid(1) YAML 1.2', function () {
    specify('should detect proper media type', async function () {
      assert.isTrue(
        await adapter.detect(`
        openapi: 3.1.0
        info:
          summary: Update an existing pet
          desc
          title: test title
      `),
      );
    });
  });

  context('given invalid(2) YAML 1.2', function () {
    specify('should detect proper media type', async function () {
      assert.isTrue(
        await adapter.detect(`
        asyncapi: 2.4.0
        info:
          version: '1.0.0'
           title: Something # Badly indented
      `),
      );
    });
  });

  it('should parse', async function () {
    const parseResult = await adapter.parse(spec, {
      sourceMap: true,
    });

    assert.isTrue(isParseResultElement(parseResult));
    assert.isTrue(isObjectElement(parseResult.result));
    expect(sexprs(parseResult)).toMatchSnapshot();
  });

  context('given zero byte empty file', function () {
    specify('should return empty parse result', async function () {
      const parseResult = await adapter.parse('', { sourceMap: true });

      assert.isTrue(parseResult.isEmpty);
    });
  });

  context('given non-zero byte empty file', function () {
    specify('should return empty parser result', async function () {
      const parseResult = await adapter.parse('  ', { sourceMap: true });

      assert.isTrue(parseResult.isEmpty);
    });
  });

  context('given invalid yaml file', function () {
    specify('should return empty parser result', async function () {
      const parseResult = await adapter.parse(' %YAML x ', { sourceMap: true });

      assert.isTrue(parseResult.isEmpty);
    });
  });

  context('given valid YAML 1.2 with very long mapping key', function () {
    specify('should parse', async function () {
      const parseResult = await adapter.parse(`/${'a'.repeat(256)}: test`);

      assert.isFalse(parseResult.isEmpty);
      expect(toValue(parseResult)).toMatchSnapshot();
    });
  });

  context('given invalid YAML 1.2 with indentation syntax error', function () {
    specify('should produce syntax error annotation', async function () {
      const syntaxErrorSpec = `
        asyncapi: 2.4.0
        info:
          version: '1.0.0'
           title: Something # Badly indented
      `;
      const parseResult = await adapter.parse(syntaxErrorSpec, { sourceMap: true });

      assert.isFalse(parseResult.isEmpty);
      assert.strictEqual(toValue(parseResult.errors.get(0)), '(Error YAML syntax error)');
    });
  });

  context('given invalid YAML 1.2 with missing mapping syntax error', function () {
    specify('should produce syntax error annotation', async function () {
      const syntaxErrorSpec = `
        asyncapi: 2.4.0
        info:
          version: '1.0.0'
          title Something # Missing mapping
      `;
      const parseResult = await adapter.parse(syntaxErrorSpec, { sourceMap: true });

      assert.isTrue(parseResult.isEmpty);
      assert.strictEqual(toValue(parseResult.errors.get(0)), '(Error YAML syntax error)');
    });
  });

  context('given valid YAML 1.2 with unrecognized tag', function () {
    specify('should throw error', async function () {
      const unknownTagSpec = 'prop: !!unknowntag value';

      try {
        await adapter.parse(unknownTagSpec);
        assert.fail('should throw YamlTagError');
        // @ts-ignore
      } catch (error: YamlTagError) {
        assert.instanceOf(error, YamlTagError);
        assert.include(error, {
          specificTagName: 'tag:yaml.org,2002:unknowntag',
          explicitTagName: '!!unknowntag',
          tagKind: 'Scalar',
          nodeCanonicalContent: undefined,
        });
        assert.include(error.tagPosition?.start, { type: 'point', row: 0, column: 6, char: 6 });
        assert.include(error.tagPosition?.end, { type: 'point', row: 0, column: 18, char: 18 });
      }
    });
  });

  context('given valid YAML 1.2 with node content failing constraints imposed by tag', function () {
    specify('should throw error', async function () {
      const unknownTagSpec = 'prop: !!int value';

      try {
        await adapter.parse(unknownTagSpec);
        assert.fail('should throw YamlTagError');
        // @ts-ignore
      } catch (error: YamlTagError) {
        assert.instanceOf(error, YamlTagError);
        assert.include(error, {
          specificTagName: 'tag:yaml.org,2002:int',
          explicitTagName: '!!int',
          tagKind: 'Scalar',
          nodeCanonicalContent: 'value',
        });
        assert.include(error.tagPosition?.start, { type: 'point', row: 0, column: 6, char: 6 });
        assert.include(error.tagPosition?.end, { type: 'point', row: 0, column: 11, char: 11 });
      }
    });
  });

  context('given an alias', function () {
    specify('should analyze alias as string', async function () {
      const result = await adapter.parse('*alias');
      assert.isTrue(isStringElement(result.result));
    });
  });

  context('given single-quote scalar containing only space characters', function () {
    specify('should parse all space characters', async function () {
      const result = await adapter.parse("' '");
      assert.strictEqual(result.toValue()[0], ' ');
    });
  });

  context('given double-quote scalar containing only space characters', function () {
    specify('should parse all space characters', async function () {
      const result = await adapter.parse('" "');
      assert.strictEqual(result.toValue()[0], ' ');
    });
  });
});
