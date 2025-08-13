import { Page } from './interfaces';
import { TokenAttribute } from './TokenAttribute';
import { TokenAttributeTypeEnum } from './TokenAttributeTypeEnum';

export const DEFAULT_PAGE: Page = {
  header: { rows: [] },
  content: { rows: [] },
  footer: { rows: [] },
  pageAttrs: {
    backgroundColor: 'white',
    marginTop: 10,
    marginRight: 0,
    marginLeft: 0,
    marginBottom: 10,
    footerMargin: 50,
    headerMargin: 30,
    defaultFont: 'Roboto'
  },
  tokenAttrs: [
    new TokenAttribute('testName', 'testValue', TokenAttributeTypeEnum.TEXT)
  ],
  partialContent: []
};
