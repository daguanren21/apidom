import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { OpenAPI3 } from '../../target-specs.ts';

const requiredRequiredLint: LinterMeta = {
  code: ApilintCodes.OPENAPI3_0_REQUEST_BODY_FIELD_CONTENT_REQUIRED,
  source: 'apilint',
  message: "should always have a 'content'",
  severity: DiagnosticSeverity.Error,
  linterFunction: 'hasRequiredField',
  linterParams: ['content'],
  marker: 'key',
  data: {
    quickFix: [
      {
        message: "add 'content' field",
        action: 'addChild',
        snippetYaml: 'content: \n  \n',
        snippetJson: '"content": {\n  \n  },\n',
      },
    ],
  },
  conditions: [
    {
      function: 'missingField',
      params: ['$ref'],
    },
  ],
  targetSpecs: OpenAPI3,
};

export default requiredRequiredLint;
