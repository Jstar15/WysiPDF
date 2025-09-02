import {TokenAttributeType} from "./token-attribute-type";

export class TokenAttribute {
  constructor(name: string,value: string,type: TokenAttributeType) {
    this.name = name;
    this.value=value;
    this.type=type;
  }
  name:string;
  value:string;
  type:TokenAttributeType;
  tokenAttributes?:TokenAttribute[];
}
