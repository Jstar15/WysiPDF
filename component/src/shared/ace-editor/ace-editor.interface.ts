export interface JsonEditorChangePayload{
  isValid: boolean;
  errorMessage: string;
  text: string;
}

export interface JsonListItem {
  name: string;
  description?: string;
  data: any;
}
