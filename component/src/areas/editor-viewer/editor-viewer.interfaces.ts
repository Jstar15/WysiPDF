import {Page} from "../../models/page";

/** Enum of editor types your viewer can host */
export enum EditorType {
  IMPORT        = 'IMPORT',
  PAGE_LAYOUT        = 'PAGE_LAYOUT',
  COLOR_PALETTE = 'COLOR_PALETTE',
  TOKEN         = 'GRID',
  PRESET        = 'PRESET'
}

export enum EditorAction {
  OK            = 'OK',
  CANCEL            = 'CANCEL'
}
