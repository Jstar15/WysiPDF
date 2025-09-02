import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import {CommonModule, NgForOf, NgIf} from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatInput, MatLabel } from '@angular/material/input';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { MatIcon } from '@angular/material/icon';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';

import { MatDialogContent } from '@angular/material/dialog'; // kept only if your template uses it for styling

import { MatTableDataSource } from '@angular/material/table';

import { TokenAttributeType } from '../../../models/TokenAttributeType';
import { TokenAttribute } from '../../../models/TokenAttribute';
import { JsonTokenParserUtility } from '../../../utils/json-token-parser.utility';

@Component({
  selector: 'app-token-editor',
  standalone: true,
  imports: [
    FormsModule,
    // Material
    MatButton,
    MatIconButton,
    MatFormField,
    MatInput,
    MatLabel,
    MatTab,
    MatTabGroup,
    MatIcon,
    MatOption,
    MatSelect,
    NgIf,
    MatDialogContent,
    NgForOf,
  ],
  templateUrl: './token-editor.component.html',
  styleUrls: ['./token-editor.component.scss']
})
export class TokenEditorComponent implements OnInit, OnChanges {
  /** Single input: current list of token attributes */
  @Input() public attributes: TokenAttribute[] = [];
  /** Single output: emits whenever attributes change */
  @Output() public attributesChange = new EventEmitter<TokenAttribute[]>();

  public tabIndex = 0;

  // add form fields
  public name = '';
  public value = '';
  public selectedType: TokenAttributeType = TokenAttributeType.TEXT;

  // strictly map to your enum values
  public readonly typeSelections: Array<{ value: TokenAttributeType; viewValue: string }> = [
    { value: TokenAttributeType.TEXT,         viewValue: 'Text' },
    { value: TokenAttributeType.BOOLEAN,      viewValue: 'Boolean' },
    { value: TokenAttributeType.NUMBER,       viewValue: 'Number' },
    { value: TokenAttributeType.JSON_ARRAY,   viewValue: 'JSON Array' },
    { value: TokenAttributeType.STRING_ARRAY, viewValue: 'STRING Array' },
    { value: TokenAttributeType.OBJECT,       viewValue: 'Object' },
    { value: TokenAttributeType.IMAGE,        viewValue: 'Image' },
    { value: TokenAttributeType.BARCODE,      viewValue: 'Barcode' }
  ];

  public dataSource = new MatTableDataSource<TokenAttribute>([]);
  public jsonText = '';
  public isJsonValid = true;
  public error: string | null = null;

  constructor(private readonly tokenParser: JsonTokenParserUtility) {}

  public ngOnInit(): void {
    this.syncDataSource();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if ('attributes' in changes) {
      this.syncDataSource(); // keep table in sync with external updates
    }
  }

  // ─────────────────────────── actions ───────────────────────────

  public canAdd(): boolean {
    return !(this.name.trim() && this.value.trim() && this.selectedType);
  }

  public addAttribute(): void {
    const newAttr: TokenAttribute = {
      name: this.name.trim(),
      value: this.value.trim(),
      type: this.selectedType
    };

    this.attributes = [...this.attributes, newAttr];
    this.syncDataSource();
    this.emitAttributes();

    // reset inputs
    this.name = '';
    this.value = '';
    this.selectedType = TokenAttributeType.TEXT;
  }

  public removeAttribute(attr: TokenAttribute): void {
    this.attributes = this.attributes.filter(
      a => !(a.name === attr.name && a.type === attr.type && a.value === attr.value)
    );
    this.syncDataSource();
    this.emitAttributes();
  }

  public validateJson(): void {
    try {
      JSON.parse(this.jsonText);
      this.isJsonValid = true;
      this.error = null;
    } catch {
      this.isJsonValid = false;
    }
  }

  public clearJson(): void {
    this.jsonText = '';
    this.isJsonValid = true;
    this.error = null;
  }

  public injectJson(): void {
    try {
      const parsedAttrs: TokenAttribute[] = this.tokenParser.parse(this.jsonText);

      this.attributes = parsedAttrs.map(a => ({
        name: a.name?.trim() ?? '',
        value: String(a.value ?? ''),
        type: a.type as TokenAttributeType
      }));

      this.syncDataSource();
      this.emitAttributes();

      this.tabIndex = 0; // back to Tokens tab
      this.error = null;
    } catch (err: any) {
      this.error = err?.message || 'Failed to parse JSON.';
    }
  }

  // ─────────────────────────── helpers ───────────────────────────

  private syncDataSource(): void {
    this.dataSource.data = this.attributes ?? [];
  }

  private emitAttributes(): void {
    this.attributesChange.emit(this.attributes);
  }
}
