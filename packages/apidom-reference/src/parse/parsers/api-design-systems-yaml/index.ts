import { pick } from 'ramda';
import { ParseResultElement } from '@swagger-api/apidom-core';
import {
  parse,
  mediaTypes as ADSMediaTypes,
  detect,
} from '@swagger-api/apidom-parser-adapter-api-design-systems-yaml';

import ParserError from '../../../errors/ParserError.ts';
import Parser, { ParserOptions } from '../Parser.ts';
import File from '../../../File.ts';

export type { default as Parser, ParserOptions } from '../Parser.ts';
export type { default as File, FileOptions } from '../../../File.ts';

/**
 * @public
 */
export interface APIDesignSystemsYAMLParserOptions extends Omit<ParserOptions, 'name'> {}

/**
 * @public
 */
class APIDesignSystemsYAMLParser extends Parser {
  public refractorOpts!: object;

  constructor(options?: APIDesignSystemsYAMLParserOptions) {
    const { fileExtensions = [], mediaTypes = ADSMediaTypes, ...rest } = options ?? {};

    super({ ...rest, name: 'api-design-systems-yaml', fileExtensions, mediaTypes });
  }

  async canParse(file: File): Promise<boolean> {
    const hasSupportedFileExtension =
      this.fileExtensions.length === 0 ? true : this.fileExtensions.includes(file.extension);
    const hasSupportedMediaType = this.mediaTypes.includes(file.mediaType);

    if (!hasSupportedFileExtension) return false;
    if (hasSupportedMediaType) return true;
    if (!hasSupportedMediaType) {
      return detect(file.toString());
    }
    return false;
  }

  async parse(file: File): Promise<ParseResultElement> {
    const source = file.toString();

    try {
      const parserOpts = pick(['sourceMap', 'refractorOpts'], this);
      return await parse(source, parserOpts);
    } catch (error: unknown) {
      throw new ParserError(`Error parsing "${file.uri}"`, { cause: error });
    }
  }
}

export default APIDesignSystemsYAMLParser;
