import {TokenAttribute} from "./token-attribute";
import {DisplayLogicGroup} from "./display-logic.models";

export interface HtmlAttributes {
    header?: number;
    bold?: string;
    italic?: string;
    underline?: string;
    size?: number;
    align?: string;
    color?: string;
    background?: string;
    font?: string;
    table?: string;
    currentColumnName?: string;
    value?: string;
    type?: string;
    isCustomElement?: boolean;
    isMergeField?: boolean;
    margin?:string;
    border?:string;
}

export interface HtmlBasicElement {
    type: 'text' | 'image' | 'token'; // add 'image'
    value: string;
    attributes: HtmlAttributes;
    token?: HtmlTokenElement;
    index?: number;
}

export interface HtmlTokenElement {
    key?: string;
    type?: string;
}

export interface HtmlBlock {
    elements: HtmlBasicElement[];
    blockType: string;
    alignment: string;
    listType?: 'ol' | 'ul';
}

export interface HtmlTableCell {
    elements: HtmlBasicElement[];
}

export interface HtmlTableRow {
    cells: HtmlTableCell[];
}

export interface HtmlTableBlock {
    blockType: 'table';
    rows: HtmlTableRow[];
}

export interface HtmlBlockContainer {
    blocks: (HtmlBlock | HtmlTableBlock | HtmlGridBlock)[];
}

export interface HtmlGridBlock {
    blockType: 'grid';
    rows: Row[];
}

export interface ImageBlock {
    imageBase64: string;
    HtmlTokenElement?: HtmlTokenElement;
    filename: string;
    width: number;
    alignment: 'left' | 'center' | 'right';
}

export interface BarcodeBlock {
  imageBase64: string;
  HtmlTokenElement?: HtmlTokenElement;
  filename: string;
  width: number;
  alignment: 'left' | 'center' | 'right';
}

export interface ChartSlice {
  attributeName: string;
  label: string;
}

export interface ChartBlock {
  chartType: 'pie' | 'doughnut'| 'bar' ;
  imageBase64: string;
  width: number;
  alignment: 'left' | 'center' | 'right';
  slices: ChartSlice[];
  tokenSourceHint?: string;
}

export interface CellAttrs {
    paddingTop?: number;
    paddingRight?: number;
    paddingBottom?: number;
    paddingLeft?: number;

    borderTop?: number;
    borderRight?: number;
    borderBottom?: number;
    borderLeft?: number;

    borderColor?: string;
    backgroundColor?: string;
}

export interface Cell {
    type: 'html' | 'image' | 'chart' | 'barcode';
    value: string;
    block?: HtmlBlockContainer;
    imageBlock?: ImageBlock
    chartBlock?: ChartBlock
    barcodeBlock?: BarcodeBlock
    attrs: CellAttrs;
    displayLogic?: DisplayLogicGroup
    hasError?:boolean;
    errorMessage?: string;
}

export interface Row {
    type?: 'content' | 'partial-content' | 'page-break';
    widths: number[];
    height: number;
    backgroundColor?: string;
    cells: Cell[];
    partialContent?: Grid;
    displayLogic?: DisplayLogicGroup
}

export interface Grid {
    id?: string;
    name?: string;
    rows: Row[];
    tokenSource?: string
    tokenAttributeList?: TokenAttribute[]
}

export interface Page {
    header: Grid;
    footer?: Grid;
    content?: Grid;
    pageAttrs?: PageAttrs;
    tokenAttrs?: TokenAttribute[];
    partialContent?: Grid[];
    colorPalettes?: string[]
}

export interface PageAttrs {
    marginTop?: number;
    marginRight?: number;
    marginBottom?: number;
    marginLeft?: number;

    headerHeight?: number;
    headerMarginTop?: number;
    headerMarginRight?: number;
    headerMarginBottom?: number;
    headerMarginLeft?: number;

    footerHeight?: number;
    footerMarginTop?: number;
    footerMarginRight?: number;
    footerMarginBottom?: number;
    footerMarginLeft?: number;


    backgroundColor?: string;
    defaultFont?: string;
}
