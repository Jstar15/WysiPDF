import {TokenAttributeType} from "./TokenAttributeType";

export class TokenAttribute {
  constructor(name: string,value: string,type: TokenAttributeType) {
    this.name = name;
    this.value=value;
    this.type=type;
  }
  name:string;
  value:string;
  type:TokenAttributeType;
}
