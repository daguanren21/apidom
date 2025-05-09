import { ParseResultElement } from '@swagger-api/apidom-core';
import {
  parse,
  mediaTypes as YAMLMediaTypes,
  detect,
} from '@swagger-api/apidom-parser-adapter-yaml-1-2';

import ParserError from '../../../errors/ParserError.ts';
import Parser, { ParserOptions } from '../Parser.ts';
import File from '../../../File.ts';

export type { default as Parser, ParserOptions } from '../Parser.ts';
export type { default as File, FileOptions } from '../../../File.ts';

/**
 * @public
 */
export interface YAMLParserOptions extends Omit<ParserOptions, 'name'> {}

/**
 * @public
 */
class YAML1Parser extends Parser {
  public refractorOpts!: object;

  constructor(options?: YAMLParserOptions) {
    const { fileExtensions = [], mediaTypes = YAMLMediaTypes, ...rest } = options ?? {};

    super({ ...rest, name: 'yaml-1-2', fileExtensions, mediaTypes });
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
      return await parse(source, { sourceMap: this.sourceMap });
    } catch (error: unknown) {
      throw new ParserError(`Error parsing "${file.uri}"`, { cause: error });
    }
  }
}

export default YAML1Parser;
