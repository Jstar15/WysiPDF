import Quill from 'quill/core';
// @ts-ignore
import EmbedBlot from 'quill/blots/embed';

export enum PageNumberType {
  CurrentPageNumber = 'currentPageNumber',
  TotalPageNumber = 'totalPageNumber'
}

export class PageNumberingElementBlot extends EmbedBlot {
  static override blotName = 'page-numbering-element';
  static override tagName = 'span';

  static override create(type: PageNumberType): HTMLElement {
    const node = super.create() as HTMLElement;

    node.classList.add('page-numbering-element'); // styling hook
    node.setAttribute('data-type', type);
    node.contentEditable = 'false';

    // Default visible placeholder text
    if (type === PageNumberType.CurrentPageNumber) {
      node.innerHTML = '{{currentPage}}';
    } else if (type === PageNumberType.TotalPageNumber) {
      node.innerHTML = '{{totalPages}}';
    }

    return node;
  }

  static override value(node: HTMLElement): PageNumberType {
    return node.getAttribute('data-type') as PageNumberType;
  }
}
