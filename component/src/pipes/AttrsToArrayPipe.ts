// attrs-to-array.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import {TokenAttribute} from "../models/token-attribute";
import {TokenAttributeType} from "../models/token-attribute-type";


@Pipe({
    name: 'attrsToArray',
    standalone: true
})
export class AttrsToArrayPipe implements PipeTransform {
    transform(attrs: Record<string, string>): TokenAttribute[] {
        // You can customize the type mapping per key if you like.
        return Object.entries(attrs).map(
            ([name, value]) =>
                new TokenAttribute(name, value, TokenAttributeType.TEXT)
        );
    }
}
