import { Injectable } from '@angular/core';
import { TokenAttribute } from "../models/TokenAttribute";
import { TokenAttributeType } from "../models/TokenAttributeType";

@Injectable({
  providedIn: 'root'
})
export class JsonTokenParserUtility {
  /**
   * Parses a JSON string and returns an array of TokenAttribute
   * @param jsonText The JSON string to parse
   * @throws SyntaxError if jsonText is invalid JSON
   */
  parse(jsonText: string): TokenAttribute[] {
    const parsed = JSON.parse(jsonText);
    const results: TokenAttribute[] = [];

    const walk = (obj: any, path = ''): void => {
      if (Array.isArray(obj)) {
        if (obj.length === 0) return;
        const first = obj[0];

        if (typeof first === 'string') {
          results.push({
            name: path,
            type: TokenAttributeType.STRING_ARRAY,
            value: JSON.stringify(obj)
          });
        } else if (typeof first === 'number') {
          results.push({
            name: path,
            type: TokenAttributeType.NUMBER,
            value: JSON.stringify(obj)
          });
        } else if (typeof first === 'boolean') {
          results.push({
            name: path,
            type: TokenAttributeType.BOOLEAN,
            value: JSON.stringify(obj)
          });
        } else if (typeof first === 'object' && first !== null) {
          results.push({
            name: path,
            type: TokenAttributeType.JSON_ARRAY,
            value: JSON.stringify(obj)
          });
        }
      } else if (obj !== null && typeof obj === 'object') {
        for (const key of Object.keys(obj)) {
          const fullPath = path ? `${path}.${key}` : key;
          walk(obj[key], fullPath);
        }
      } else {
        let attrType: TokenAttributeType;
        switch (typeof obj) {
          case 'string':
            attrType = TokenAttributeType.TEXT;
            break;
          case 'number':
            attrType = TokenAttributeType.NUMBER;
            break;
          case 'boolean':
            attrType = TokenAttributeType.BOOLEAN;
            break;
          default:
            attrType = TokenAttributeType.TEXT;
        }
        results.push({
          name: path,
          type: attrType,
          value: obj === null ? 'null' : obj.toString()
        });
      }
    };

    walk(parsed);
    return results;
  }

  // ------------------------------
  // 🔥 JSONB-style helper methods
  // ------------------------------

  /** Get raw value from JSON object by dot-separated path (like jsonb -> '#>') */
  public getValueByPath(obj: any, path: string): any {
    if (!obj || !path) return null;
    return path.split('.').reduce((acc, key) => {
      if (acc && typeof acc === 'object' && key in acc) {
        return acc[key];
      }
      return null;
    }, obj);
  }

  /** 🔍 Extract all unique keys from a JSON array of objects */
  public getAllKeysFromJsonArray(arr: any[]): string[] {
    const keys = new Set<string>();

    if (!Array.isArray(arr)) return [];

    arr.forEach(item => {
      if (item && typeof item === 'object' && !Array.isArray(item)) {
        Object.keys(item).forEach(k => keys.add(k));
      }
    });

    return Array.from(keys);
  }

  getAvailableTokensFromJsonList(sourceName: string, tokenAttrs: TokenAttribute[]): TokenAttribute[] {
    const root: TokenAttribute = tokenAttrs.find(attr =>
      attr.name === sourceName && attr.type === TokenAttributeType.JSON_ARRAY
    );

    if (!root) return [];

    try {
      const parsed = JSON.parse(root.value);
      if (!Array.isArray(parsed) || parsed.length === 0 || typeof parsed[0] !== 'object') {
        return [];
      }

      const firstItem = parsed[0];
      return Object.keys(firstItem).map(key => {
        const value = firstItem[key];
        let type: TokenAttributeType;

        switch (typeof value) {
          case 'string':
            type = TokenAttributeType.TEXT;
            break;
          case 'number':
            type = TokenAttributeType.NUMBER;
            break;
          case 'boolean':
            type = TokenAttributeType.BOOLEAN;
            break;
          case 'object':
            type = Array.isArray(value)
              ? TokenAttributeType.STRING_ARRAY
              : TokenAttributeType.OBJECT;
            break;
          default:
            type = TokenAttributeType.TEXT;
        }

        return new TokenAttribute(`${sourceName}.${key}`, '', type);
      });
    } catch (err) {
      console.warn('Failed to parse json[] value:', root?.value);
      return [];
    }
  }
}
