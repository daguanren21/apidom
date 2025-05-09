import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { OpenAPI2 } from '../../target-specs.ts';

const basePathPatternLint: LinterMeta = {
  code: ApilintCodes.OPENAPI2_SWAGGER_FIELD_BASE_PATH_PATTERN,
  source: 'apilint',
  message: '"basePath" value MUST be a relative URI Referencing starting with a leading slash (/).',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintValueRegex',
  linterParams: ['^/(?:[^/\\s][^\\s]*)?$'],
  target: 'basePath',
  marker: 'value',
  data: {},
  targetSpecs: OpenAPI2,
};

export default basePathPatternLint;
