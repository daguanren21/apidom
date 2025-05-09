import {
  ApidomCompletionItem,
  CompletionFormat,
  CompletionType,
} from '../../../apidom-language-types.ts';
import { OpenAPI2, OpenAPI30, OpenAPI31 } from '../target-specs.ts';

// eslint-disable-next-line @typescript-eslint/naming-convention
const httpCode3_0CompletionItem = {
  kind: 14,
  format: CompletionFormat.OBJECT,
  type: CompletionType.PROPERTY,
  insertTextFormat: 2,
  documentation: {
    kind: 'markdown',
    value:
      "[Response Object](https://spec.openapis.org/oas/v3.0.4.html#response-object) \\| [Reference Object](https://spec.openapis.org/oas/v3.0.4.html#reference-object)\n\\\n\\\nThe documentation of responses other than the ones declared for specific HTTP response codes. Use this field to cover undeclared responses. A [Reference Object](https://spec.openapis.org/oas/v3.0.4.html#reference-object) can link to a response that the [OpenAPI Object's components/responses](https://spec.openapis.org/oas/v3.0.4.html#components-responses) section defines.",
  },
  targetSpecs: OpenAPI30,
};

// eslint-disable-next-line @typescript-eslint/naming-convention
const httpCode3_1CompletionRule = {
  kind: 14,
  format: CompletionFormat.OBJECT,
  type: CompletionType.PROPERTY,
  insertTextFormat: 2,
  documentation: {
    kind: 'markdown',
    value:
      '[Response Object](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#responseObject) \\| [Reference Object](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#referenceObject)\n\\\n\\\nThe documentation of responses other than the ones declared for specific HTTP response codes. Use this field to cover undeclared responses.',
  },
  targetSpecs: OpenAPI31,
};

const completion: ApidomCompletionItem[] = [
  {
    label: 'default',
    insertText: 'default',
    kind: 14,
    format: CompletionFormat.OBJECT,
    type: CompletionType.PROPERTY,
    insertTextFormat: 2,
    documentation: {
      kind: 'markdown',
      value:
        "[Response Object](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#responseObject) \\| [Reference Object](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#referenceObject)\n\\\n\\\nThe documentation of responses other than the ones declared for specific HTTP response codes. It can be used to cover undeclared responses. [Reference Object](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#referenceObject) can be used to link to a response that is defined at the [Swagger Object's responses](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#swaggerResponses) section.",
    },
    targetSpecs: OpenAPI2,
  },
  {
    label: 'default',
    insertText: 'default',
    ...httpCode3_0CompletionItem,
  } as ApidomCompletionItem,
  {
    label: 'default',
    insertText: 'default',
    ...httpCode3_1CompletionRule,
  } as ApidomCompletionItem,
  {
    label: '1XX',
    insertText: '1XX',
    ...httpCode3_0CompletionItem,
  } as ApidomCompletionItem,
  {
    label: '1XX',
    insertText: '1XX',
    ...httpCode3_1CompletionRule,
  } as ApidomCompletionItem,
  {
    label: '2XX',
    insertText: '2XX',
    ...httpCode3_0CompletionItem,
  } as ApidomCompletionItem,
  {
    label: '2XX',
    insertText: '2XX',
    ...httpCode3_1CompletionRule,
  } as ApidomCompletionItem,
  {
    label: '3XX',
    insertText: '3XX',
    ...httpCode3_0CompletionItem,
  } as ApidomCompletionItem,
  {
    label: '3XX',
    insertText: '3XX',
    ...httpCode3_1CompletionRule,
  } as ApidomCompletionItem,
  {
    label: '4XX',
    insertText: '4XX',
    ...httpCode3_0CompletionItem,
  } as ApidomCompletionItem,
  {
    label: '4XX',
    insertText: '4XX',
    ...httpCode3_1CompletionRule,
  } as ApidomCompletionItem,
  {
    label: '5XX',
    insertText: '5XX',
    ...httpCode3_0CompletionItem,
  } as ApidomCompletionItem,
  {
    label: '5XX',
    insertText: '5XX',
    ...httpCode3_1CompletionRule,
  } as ApidomCompletionItem,
];

export default completion;
