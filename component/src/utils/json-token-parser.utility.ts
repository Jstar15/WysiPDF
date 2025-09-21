import { Injectable } from '@angular/core';
import { TokenAttribute } from '../models/token-attribute';
import { TokenAttributeType } from '../models/token-attribute-type';

@Injectable()
export class JsonTokenParserUtility {

  /** Back-compat: return a flat list with dot paths */
  public parse(jsonText: string): TokenAttribute[] {

    const newTokens : TokenAttribute[] = []
    const obj: any = JSON.parse(jsonText);
    const keys: string[] = this.getAllKeysForObject(obj);

    for (let key of keys) {
      const name: string = key;
      const value = this.resolvePath(obj, key);
      const type: TokenAttributeType = this.deferType(value);

      let token: TokenAttribute;

      // STRING_ARRAY: store JSON string in `value` but keep parsed array in `valueArray`
      if (type === TokenAttributeType.STRING_ARRAY && Array.isArray(value)) {
        token = {
          name,
          type,
          value: JSON.stringify(value),
          valueArray: value.map(v => (v == null ? '' : String(v)))
        };
      }
      // Array of objects
      else if (type === TokenAttributeType.JSON_ARRAY && Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
        const first = JSON.stringify(value[0]);
        const innerTokenAttributes: TokenAttribute[] = this.parse(first);
        for (let t of innerTokenAttributes) {
          t.valueArray = this.parseValues(t.name, value);
        }
        token = {
          name,
          type,
          value: JSON.stringify(value), // <--- store JSON string
          tokenAttributes: innerTokenAttributes
        };
      }
      // Object
      else if (type === TokenAttributeType.OBJECT && value) {
        token = {
          name,
          type,
          value: JSON.stringify(value), // <--- store JSON string
          tokenAttributes: this.parse(JSON.stringify(value))
        };
      }
      // Primitive value
      else {
        token = {
          name,
          type,
          value: value == null ? '' : String(value)
        };
      }

      newTokens.push(token);
    }

    return newTokens;
  }

  private resolvePath(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => (acc ? acc[part] : undefined), obj);
  }

  private deferType(value: any): TokenAttributeType {
    if (value === null || value === undefined) return TokenAttributeType.TEXT;

    // Detect image URLs or base64 images
    if (typeof value === 'string') {
      const isBase64Image = /^data:image\/[a-zA-Z]+;base64,/.test(value);
      const isImageUrl = /\.(png|jpg|jpeg|gif|bmp|svg|webp)$/i.test(value);
      if (isBase64Image || isImageUrl) {
        return TokenAttributeType.IMAGE;
      }
      return TokenAttributeType.TEXT;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) return TokenAttributeType.JSON_ARRAY;
      if (value.every(v => typeof v === 'string')) return TokenAttributeType.STRING_ARRAY;
      return TokenAttributeType.JSON_ARRAY;
    }

    switch (typeof value) {
      case 'number': return TokenAttributeType.NUMBER;
      case 'boolean': return TokenAttributeType.BOOLEAN;
      case 'object': return TokenAttributeType.OBJECT;
      default: return TokenAttributeType.TEXT;
    }
  }

  private getAllKeysForObject(obj: any, parentKey: string = ''): string[] {
    let keys: string[] = [];
    if (obj === null || obj === undefined) return keys;

    if (Array.isArray(obj)) {
      if (parentKey) keys.push(parentKey);
      return keys;
    } else if (typeof obj === 'object') {
      for (const k of Object.keys(obj)) {
        const newKey = parentKey ? `${parentKey}.${k}` : k;
        keys = keys.concat(this.getAllKeysForObject(obj[k], newKey));
      }
    } else {
      keys.push(parentKey);
    }

    return keys;
  }

  private parseValues(tokenName: string, values: any[]): string[] {
    if (!Array.isArray(values)) return [];

    const out: string[] = [];
    const pushFlattened = (v: any) => {
      if (Array.isArray(v)) {
        for (const item of v) pushFlattened(item);
      } else {
        out.push(v == null ? '' : String(v));
      }
    };

    for (const el of values) {
      const v = tokenName ? this.resolvePath(el, tokenName) : el;
      pushFlattened(v);
    }

    return out;
  }


}
