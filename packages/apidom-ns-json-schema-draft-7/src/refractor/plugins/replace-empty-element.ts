import {
  ArrayElement,
  ObjectElement,
  StringElement,
  isStringElement,
  isArrayElement,
  isElement,
  isMemberElement,
  includesClasses,
  cloneDeep,
  toValue,
} from '@swagger-api/apidom-core';
/**
 * JSON Schema Draft 7 specification elements.
 */

import JSONSchemaElement from '../../elements/JSONSchema.ts';
import LinkDescriptionElement from '../../elements/LinkDescription.ts';
import { getNodeType } from '../../traversal/visitor.ts';

/**
 * This plugin is specific to YAML 1.2 format, which allows defining key-value pairs
 * with empty key, empty value, or both. If the value is not provided in YAML format,
 * this plugin compensates for this missing value with the most appropriate semantic element type.
 *
 * https://yaml.org/spec/1.2.2/#72-empty-nodes
 *
 * @example
 *
 * ```yaml
 * $schema: http://json-schema.org/draft-07/schema#
 * items:
 * ```
 * Refracting result without this plugin:
 *
 *  (JSONSchemaElement
 *    (MemberElement
 *      (StringElement)
 *      (StringElement))
 *    (MemberElement
 *      (StringElement)
 *      (StringElement))
 *
 * Refracting result with this plugin:
 *
 *  (JSONSchemaElement
 *    (MemberElement
 *      (StringElement)
 *      (StringElement))
 *    (MemberElement
 *      (StringElement)
 *      (JSONSchemaElement))
 */

const isEmptyElement = (element: any) =>
  isStringElement(element) && includesClasses(['yaml-e-node', 'yaml-e-scalar'], element);

const schema = {
  JSONSchemaDraft7Element: {
    additionalItems(...args: any[]) {
      return new JSONSchemaElement(...args);
    },
    items(...args: any[]) {
      return new JSONSchemaElement(...args);
    },
    contains(...args: any[]) {
      return new JSONSchemaElement(...args);
    },
    required(...args: any[]) {
      const element = new ArrayElement(...args);
      element.classes.push('json-schema-required');
      return element;
    },
    properties(...args: any[]) {
      const element = new ObjectElement(...args);
      element.classes.push('json-schema-properties');
      return element;
    },
    additionalProperties(...args: any[]) {
      return new JSONSchemaElement(...args);
    },
    patternProperties(...args: any[]) {
      const element = new ObjectElement(...args);
      element.classes.push('json-schema-patternProperties');
      return element;
    },
    dependencies(...args: any[]) {
      const element = new ObjectElement(...args);
      element.classes.push('json-schema-dependencies');
      return element;
    },
    propertyNames(...args: any[]) {
      return new JSONSchemaElement(...args);
    },
    enum(...args: any[]) {
      const element = new ArrayElement(...args);
      element.classes.push('json-schema-enum');
      return element;
    },
    allOf(...args: any[]) {
      const element = new ArrayElement(...args);
      element.classes.push('json-schema-allOf');
      return element;
    },
    anyOf(...args: any[]) {
      const element = new ArrayElement(...args);
      element.classes.push('json-schema-anyOf');
      return element;
    },
    oneOf(...args: any[]) {
      const element = new ArrayElement(...args);
      element.classes.push('json-schema-oneOf');
      return element;
    },
    if(...args: any[]) {
      return new JSONSchemaElement(...args);
    },
    then(...args: any[]) {
      return new JSONSchemaElement(...args);
    },
    else(...args: any[]) {
      return new JSONSchemaElement(...args);
    },
    not(...args: any[]) {
      return new JSONSchemaElement(...args);
    },
    definitions(...args: any[]) {
      const element = new ObjectElement(...args);
      element.classes.push('json-schema-definitions');
      return element;
    },
    examples(...args: any[]) {
      const element = new ArrayElement(...args);
      element.classes.push('json-schema-examples');
      return element;
    },
    links(...args: any[]) {
      const element = new ArrayElement(...args);
      element.classes.push('json-schema-links');
      return element;
    },
  },
  LinkDescriptionElement: {
    hrefSchema(...args: any[]) {
      return new JSONSchemaElement(...args);
    },
    targetSchema(...args: any[]) {
      return new JSONSchemaElement(...args);
    },
    submissionSchema(...args: any[]) {
      return new JSONSchemaElement(...args);
    },
    templatePointers(...args: any[]) {
      return new ObjectElement(...args);
    },
    templateRequired(...args: any[]) {
      return new ArrayElement(...args);
    },
    targetHints(...args: any[]) {
      return new ObjectElement(...args);
    },
    headerSchema(...args: any[]) {
      return new JSONSchemaElement(...args);
    },
  },
  'json-schema-properties': {
    '[key: *]': function key(...args: any[]) {
      return new JSONSchemaElement(...args);
    },
  },
  'json-schema-patternProperties': {
    '[key: *]': function key(...args: any[]) {
      return new JSONSchemaElement(...args);
    },
  },
  'json-schema-dependencies': {
    '[key: *]': function key(...args: any[]) {
      return new JSONSchemaElement(...args);
    },
  },
  'json-schema-allOf': {
    '<*>': function asterisk(...args: any[]) {
      return new JSONSchemaElement(...args);
    },
  },
  'json-schema-anyOf': {
    '<*>': function asterisk(...args: any[]) {
      return new JSONSchemaElement(...args);
    },
  },
  'json-schema-oneOf': {
    '<*>': function asterisk(...args: any[]) {
      return new JSONSchemaElement(...args);
    },
  },
  'json-schema-definitions': {
    '[key: *]': function key(...args: any[]) {
      return new JSONSchemaElement(...args);
    },
  },
  'json-schema-links': {
    '<*>': function asterisk(...args: any[]) {
      return new LinkDescriptionElement(...args);
    },
  },
};

const findElementFactory = (ancestor: any, keyName: string) => {
  const elementType = getNodeType(ancestor); // @ts-ignore
  const keyMapping = schema[elementType] || schema[toValue(ancestor.classes.first)];

  return typeof keyMapping === 'undefined'
    ? undefined
    : Object.prototype.hasOwnProperty.call(keyMapping, '[key: *]')
      ? keyMapping['[key: *]']
      : keyMapping[keyName];
};

/**
 * @public
 */
const plugin = () => () => {
  return {
    visitor: {
      StringElement(element: StringElement, key: any, parent: any, path: any, ancestors: any[]) {
        if (!isEmptyElement(element)) return undefined;

        const lineage = [...ancestors, parent].filter(isElement);
        const parentElement = lineage[lineage.length - 1]; // @TODO(vladimir.gorej@gmail.com): can be replaced by Array.prototype.at in future
        let elementFactory;
        let context;

        if (isArrayElement(parentElement)) {
          context = element;
          elementFactory = findElementFactory(parentElement, '<*>');
        } else if (isMemberElement(parentElement)) {
          context = lineage[lineage.length - 2]; // @TODO(vladimir.gorej@gmail.com): can be replaced by Array.prototype.at in future
          elementFactory = findElementFactory(context, toValue(parentElement.key));
        }

        // no element factory found
        if (typeof elementFactory !== 'function') return undefined;

        return elementFactory.call(
          { context },
          undefined,
          cloneDeep(element.meta),
          cloneDeep(element.attributes),
        );
      },
    },
  };
};

export default plugin;
