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

                // Primitive arrays
                if (typeof first === 'string') {
                    results.push({
                        name: path,
                        type: TokenAttributeTypeEnum.STRING_ARRAY,
                        value: JSON.stringify(obj)
                    });
                }
                else if (typeof first === 'number') {
                    results.push({
                        name: path,
                        type: TokenAttributeTypeEnum.NUMBER,
                        value: JSON.stringify(obj)
                    });
                }
                else if (typeof first === 'boolean') {
                    results.push({
                        name: path,
                        type: TokenAttributeTypeEnum.BOOLEAN,
                        value: JSON.stringify(obj)
                    });
                }
                // Object array — only emit the base path, do NOT recurse into [0],[1],…
                else if (typeof first === 'object' && first !== null) {
                    results.push({
                        name: path,
                        type: TokenAttributeTypeEnum.JSON_ARRAY,
                        value: JSON.stringify(obj)
                    });
                    // <<-- removed obj.forEach(...) so we don't generate numbered names
                }
            }
            else if (obj !== null && typeof obj === 'object') {
                // Nested plain objects
                for (const key of Object.keys(obj)) {
                    const fullPath = path ? `${path}.${key}` : key;
                    walk(obj[key], fullPath);
                }
            }
            else {
                // Primitives
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
}
