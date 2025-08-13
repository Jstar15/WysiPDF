import {TokenAttributeTypeEnum} from "./TokenAttributeTypeEnum";

export class TokenAttribute {
  constructor(name: string,value: string,type: TokenAttributeTypeEnum) {
    this.name = name;
    this.value=value;
    this.type=type;
  }
  name:string;
  value:string;
  type:TokenAttributeTypeEnum;
}
