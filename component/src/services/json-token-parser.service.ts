// src/app/services/json-token-parser.service.ts
import { Injectable } from '@angular/core';
import { TokenAttribute } from "../models/TokenAttribute";
import { TokenAttributeTypeEnum } from "../models/TokenAttributeTypeEnum";

@Injectable({
  providedIn: 'root'
})
export class JsonTokenParserService {
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
            type: TokenAttributeTypeEnum.STRING_ARRAY,
            value: JSON.stringify(obj)
          });
        } else if (typeof first === 'number') {
          results.push({
            name: path,
            type: TokenAttributeTypeEnum.NUMBER,
            value: JSON.stringify(obj)
          });
        } else if (typeof first === 'boolean') {
          results.push({
            name: path,
            type: TokenAttributeTypeEnum.BOOLEAN,
            value: JSON.stringify(obj)
          });
        } else if (typeof first === 'object' && first !== null) {
          results.push({
            name: path,
            type: TokenAttributeTypeEnum.JSON_ARRAY,
            value: JSON.stringify(obj)
          });
        }
      } else if (obj !== null && typeof obj === 'object') {
        for (const key of Object.keys(obj)) {
          const fullPath = path ? `${path}.${key}` : key;
          walk(obj[key], fullPath);
        }
      } else {
        let attrType: TokenAttributeTypeEnum;
        switch (typeof obj) {
          case 'string':
            attrType = TokenAttributeTypeEnum.TEXT;
            break;
          case 'number':
            attrType = TokenAttributeTypeEnum.NUMBER;
            break;
          case 'boolean':
            attrType = TokenAttributeTypeEnum.BOOLEAN;
            break;
          default:
            attrType = TokenAttributeTypeEnum.TEXT;
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

  /** Get string value by path (like jsonb ->>) */
  public getTextByPath(obj: any, path: string): string | null {
    const val = this.getValueByPath(obj, path);
    return val !== null && val !== undefined ? String(val) : null;
  }

  /** Check if a key exists at a given path (like jsonb_exists) */
  public hasKey(obj: any, path: string): boolean {
    if (!obj || !path) return false;
    const keys = path.split('.');
    let current = obj;
    for (let k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        return false;
      }
    }
    return true;
  }

  /** Return sub-object as JSON string (like jsonb_extract_path) */
  public extractJson(obj: any, path: string): string | null {
    const val = this.getValueByPath(obj, path);
    return val ? JSON.stringify(val) : null;
  }

  /** Flatten sub-object into TokenAttributes (like jsonb_each) */
  public extractTokens(obj: any, path: string): TokenAttribute[] {
    const val = this.getValueByPath(obj, path);
    if (!val) return [];
    return this.parse(JSON.stringify(val));
  }
}
