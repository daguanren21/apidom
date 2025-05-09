import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { OpenAPI3 } from '../../target-specs.ts';

const examplesValuesTypeLint: LinterMeta = {
  code: ApilintCodes.OPENAPI3_0_COMPONENTS_FIELD_EXAMPLES_VALUES_TYPE,
  source: 'apilint',
  message: '"examples" members must be Example Object',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintChildrenOfElementsOrClasses',
  linterParams: [['example']],
  marker: 'key',
  markerTarget: 'examples',
  target: 'examples',
  data: {},
  targetSpecs: OpenAPI3,
};

export default examplesValuesTypeLint;
