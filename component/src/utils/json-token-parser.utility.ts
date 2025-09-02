import { Injectable } from '@angular/core';
import { TokenAttribute } from '../models/token-attribute';
import { TokenAttributeType } from '../models/token-attribute-type';

@Injectable({ providedIn: 'root' })
export class JsonTokenParserUtility {

  /** Back-compat: return a flat list with dot paths */
  public parse(jsonText: string, newKey = ""): TokenAttribute[] {

    const newTokens : TokenAttribute[] = []
    const obj: any = JSON.parse(jsonText);
    const keys: string[] = this.getAllKeysForObject(obj);

    for (let key of keys) {
      const name: string = key;
      const value = this.resolvePath(obj, key);

      const type: TokenAttributeType = this.deferType(value);
      let token: TokenAttribute;
      if ((type == TokenAttributeType.JSON_ARRAY || type == TokenAttributeType.OBJECT) && value && value.length > 0) {
        const first: string = JSON.stringify(value[0]);
        token = {
          tokenAttributes: this.parse(first, name),
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

  // ─────────────────────────────────────────────────────────────
  public getAllKeysFromJsonArray(arr: any[]): string[] {
    if (!Array.isArray(arr) || arr.length === 0) {
      return [];
    }

    const keySet = new Set<string>();

    for (const item of arr) {
      if (item && typeof item === 'object' && !Array.isArray(item)) {
        for (const key of Object.keys(item)) {
          keySet.add(key);
        }
      }
    }

    return Array.from(keySet);
  }


  public getAvailableTokensFromJsonList(sourceName: string, tokenAttrs: TokenAttribute[]): TokenAttribute[] {
    if (!sourceName || sourceName === 'root') {
      return tokenAttrs;
    }

    const parts = sourceName.split('.');

    let current: TokenAttribute[] | undefined = tokenAttrs;

    for (const part of parts) {
      if (!current) return [];

      const match = current.find(t => t.name === part || t.name.endsWith('.' + part));
      if (!match) return [];

      current = match.tokenAttributes;
    }

    return current ?? [];
  }

}
