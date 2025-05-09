import { Mixin } from 'ts-mixer';
import { always } from 'ramda';

import KafkaServerBindingElement from '../../../../../../elements/bindings/kafka/KafkaServerBinding.ts';
import FixedFieldsVisitor, {
  FixedFieldsVisitorOptions,
  SpecPath,
} from '../../../../generics/FixedFieldsVisitor.ts';
import FallbackVisitor, { FallbackVisitorOptions } from '../../../../FallbackVisitor.ts';

/**
 * @public
 */
export interface KafkaServerBindingVisitorOptions
  extends FixedFieldsVisitorOptions,
    FallbackVisitorOptions {}

/**
 * @public
 */
class KafkaServerBindingVisitor extends Mixin(FixedFieldsVisitor, FallbackVisitor) {
  declare public readonly element: KafkaServerBindingElement;

  declare protected readonly specPath: SpecPath<
    ['document', 'objects', 'bindings', 'kafka', 'ServerBinding']
  >;

  declare protected readonly canSupportSpecificationExtensions: false;

  constructor(options: KafkaServerBindingVisitorOptions) {
    super(options);
    this.element = new KafkaServerBindingElement();
    this.specPath = always(['document', 'objects', 'bindings', 'kafka', 'ServerBinding']);
    this.canSupportSpecificationExtensions = false;
  }
}

export default KafkaServerBindingVisitor;
