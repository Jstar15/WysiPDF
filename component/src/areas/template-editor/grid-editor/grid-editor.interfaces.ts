
export interface GridEvent {
  type: GridEventType;
  area: string;
}



export enum GridEventType {
  ADD_ROW              = 'ADD_ROW',
  REMOVE_ROW           = 'REMOVE_ROW',
  DUPLICATE_ROW        = 'DUPLICATE_ROW',
  ADD_COLUMN           = 'ADD_COLUMN',
  REMOVE_COLUMN        = 'REMOVE_COLUMN',
  ADD_PAGE_BREAK       = 'ADD_PAGE_BREAK'
}

