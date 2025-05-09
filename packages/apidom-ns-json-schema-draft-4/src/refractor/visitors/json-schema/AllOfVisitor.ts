import { Mixin } from 'ts-mixer';
import { ArrayElement, Element, BREAK } from '@swagger-api/apidom-core';

import FallbackVisitor, { FallbackVisitorOptions } from '../FallbackVisitor.ts';
import SpecificationVisitor, { SpecificationVisitorOptions } from '../SpecificationVisitor.ts';
import ParentSchemaAwareVisitor, {
  ParentSchemaAwareVisitorOptions,
} from './ParentSchemaAwareVisitor.ts';
import { isJSONReferenceLikeElement } from '../../predicates.ts';

/**
 * @public
 */
export interface AllOfVisitorOptions
  extends SpecificationVisitorOptions,
    ParentSchemaAwareVisitorOptions,
    FallbackVisitorOptions {}

/**
 * @public
 */
class AllOfVisitor extends Mixin(SpecificationVisitor, ParentSchemaAwareVisitor, FallbackVisitor) {
  declare public readonly element: ArrayElement;

  constructor(options: AllOfVisitorOptions) {
    super(options);
    this.element = new ArrayElement();
    this.element.classes.push('json-schema-allOf');
  }

  ArrayElement(arrayElement: ArrayElement) {
    arrayElement.forEach((item: Element): void => {
      const specPath = isJSONReferenceLikeElement(item)
        ? ['document', 'objects', 'JSONReference']
        : ['document', 'objects', 'JSONSchema'];
      const element = this.toRefractedElement(specPath, item);
      this.element.push(element);
    });

    this.copyMetaAndAttributes(arrayElement, this.element);

    return BREAK;
  }
}

export default AllOfVisitor;
