import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { OpenAPI2 } from '../../target-specs.ts';

const uniqueItemsTypeLint: LinterMeta = {
  code: ApilintCodes.OPENAPI2_HEADER_FIELD_UNIQUE_ITEMS_TYPE,
  source: 'apilint',
  message: 'uniqueItems must be a boolean',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintType',
  linterParams: ['boolean'],
  marker: 'value',
  target: 'uniqueItems',
  data: {},
  targetSpecs: OpenAPI2,
};

export default uniqueItemsTypeLint;
