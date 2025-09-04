import { Injectable } from '@angular/core';
import { TokenAttribute } from '../models/token-attribute';
import { TokenAttributeType } from '../models/token-attribute-type';

@Injectable({ providedIn: 'root' })
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
      if ((type == TokenAttributeType.JSON_ARRAY) && value && value.length > 0) {
        const first: string = JSON.stringify(value[0]);
        const innerTokenAttributes: TokenAttribute[] = this.parse(first)
        for(let token of innerTokenAttributes){
          const tokenName: string = token.name;
          token.valueArray = this.parseValues(tokenName, value);
        }
        debugger;
        token = {
          tokenAttributes: innerTokenAttributes,
          type: type,
          value: value,
          name: name
        }
      }else if ((type == TokenAttributeType.OBJECT) && value) {
        token = {
          tokenAttributes: this.parse(value),
          type: type,
          value: value,
          name: name
        }
      } else {
        token = {
          type: type,
          value: value,
          name: name
        }
      }
      newTokens.push(token);
    }
    return newTokens;
  }

  /** Resolve nested "a.b.c" path safely */
  private resolvePath(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => (acc ? acc[part] : undefined), obj);
  }

  /** Decide TokenAttributeType based on JS value */
  private deferType(value: any): TokenAttributeType {
    if (value === null || value === undefined) {
      return TokenAttributeType.TEXT;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return TokenAttributeType.JSON_ARRAY;
      }

      const first = value[0];

      if (typeof first === 'string' && value.every(v => typeof v === 'string')) {
        return TokenAttributeType.STRING_ARRAY;
      }
      if (typeof first === 'number' && value.every(v => typeof v === 'number')) {
        return TokenAttributeType.JSON_ARRAY;
      }
      if (typeof first === 'boolean' && value.every(v => typeof v === 'boolean')) {
        return TokenAttributeType.JSON_ARRAY;
      }
      if (typeof first === 'object' && value.every(v => v !== null && typeof v === 'object')) {
        return TokenAttributeType.JSON_ARRAY;
      }

      return TokenAttributeType.JSON_ARRAY;
    }

    switch (typeof value) {
      case 'string': return TokenAttributeType.TEXT;
      case 'number': return TokenAttributeType.NUMBER;
      case 'boolean': return TokenAttributeType.BOOLEAN;
      case 'object': return TokenAttributeType.OBJECT;
      default: return TokenAttributeType.TEXT;
    }
  }

  private getAllKeysForObject(obj: any, parentKey: string = ''): string[] {
    let keys: string[] = [];

    if (obj === null || obj === undefined) {
      return keys;
    }

    if (Array.isArray(obj)) {
      if (parentKey) {
        keys.push(parentKey);
      }
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


  private parseValues(
    tokenName: string,
    values: any[]
  ): string[] {
    if (!Array.isArray(values)) return [];

    const toStr = (v: any): string =>
      v == null
        ? ''
        : typeof v === 'string'
          ? v
          : typeof v === 'number' || typeof v === 'boolean'
            ? String(v)
            : JSON.stringify(v);

    const out: string[] = [];

    const pushFlattened = (v: any) => {
      if (Array.isArray(v)) {
        for (const item of v) pushFlattened(item); // deep-flatten arrays
      } else {
        out.push(toStr(v));
      }
    };

    for (const el of values) {
      const v = tokenName ? this.resolvePath(el, tokenName) : el;
      pushFlattened(v);
    }

    return out;
  }


}
