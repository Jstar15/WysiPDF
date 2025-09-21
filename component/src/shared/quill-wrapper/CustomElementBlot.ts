import Quill from 'quill/core';
// @ts-ignore
import EmbedBlot from 'quill/blots/embed';
import { TokenAttribute } from '../../models/token-attribute';

export class CustomElementBlot extends EmbedBlot {
  static override blotName = 'custom-element';
  static override tagName = 'span';

  static override create(value: TokenAttribute): HTMLElement {
    const node = super.create() as any;

    node.classList.add('custom-token'); // optional styling hook
    node.setAttribute('data-value', '<<' + value.name + '>>');
    node.setAttribute('data-type', value.type);
    node.setAttribute('data-name', value.name);

    node.contentEditable = 'false';
    node.innerHTML = `${value.type}[${value.name}]`;

    return node;
  }


}
