import {
  Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges
} from '@angular/core';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatInput, MatLabel } from '@angular/material/input';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { MatIcon } from '@angular/material/icon';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';

import { MatDialog, MatDialogContent, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { TokenAttributeType } from '../../../models/token-attribute-type';
import { TokenAttribute } from '../../../models/token-attribute';
import { JsonTokenParserUtility } from '../../../utils/json-token-parser.utility';

import {
  JsonArrayEditorDialogComponent,
  JsonArrayEditorDialogData
} from '../../../dialogs/json-array-editor-dialog/json-array-editor-dialog.component';

@Component({
  selector: 'app-token-editor',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatButton, MatIconButton,
    MatFormField, MatInput, MatLabel,
    MatTab, MatTabGroup,
    MatIcon, MatOption, MatSelect,
    MatDialogContent, MatDialogModule,
    NgIf, NgForOf,
  ],
  templateUrl: './token-editor.component.html',
  styleUrls: ['./token-editor.component.scss']
})
export class TokenEditorComponent implements OnInit, OnChanges {
  @Input() public attributes: TokenAttribute[] = [];
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
 //   { value: TokenAttributeType.OBJECT,       viewValue: 'Object' },
    { value: TokenAttributeType.IMAGE,        viewValue: 'Image' },
    { value: TokenAttributeType.BARCODE,      viewValue: 'Barcode' }
  ];

  public dataSource = new MatTableDataSource<TokenAttribute>([]);
  public jsonText = '';
  public isJsonValid = true;
  public error: string | null = null;

  TokenAttributeType = TokenAttributeType; // expose enum to template

  constructor(
    private readonly tokenParser: JsonTokenParserUtility,
    private readonly dialog: MatDialog
  ) {}

  public ngOnInit(): void {
    this.syncDataSource();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if ('attributes' in changes) {
      this.syncDataSource();
    }
  }

  public canAdd(): boolean {
    if (!this.name.trim() || !this.selectedType) return true;
    if (this.selectedType === TokenAttributeType.JSON_ARRAY) return false;
    return !this.value.trim();
  }

  public addAttribute(): void {
    const newAttr: TokenAttribute = {
      name: this.name.trim(),
      value: this.value,
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

  /** If a row’s type changes to JSON_ARRAY, ensure value is valid JSON array */
  public onTypeChange(element: TokenAttribute): void {
    if (element.type === TokenAttributeType.JSON_ARRAY) {
      // initialize to [] if empty or invalid
      if (!this.isParsableJsonArray(element.value)) {
        element.value = '[]';
      }
    }
    this.emitAttributes();
  }

  /** Open the dialog to edit the JSON array for this element */
  public openJsonArrayEditor(element: TokenAttribute): void {
    const data: JsonArrayEditorDialogData = {
      items: element.tokenAttributes,
      title: `Edit "${element.name}" JSON Array`
    };

    const ref = this.dialog.open(JsonArrayEditorDialogComponent, {
      width: '760px',
      data
    });

    ref.afterClosed().subscribe((updated?: TokenAttribute[] | null) => {
      if (updated) {
        element.tokenAttributes = updated;
        this.syncDataSource();
        this.emitAttributes();
      }
    });
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

      console.log(parsedAttrs)
      this.attributes = parsedAttrs.map(a => ({
        name: a.name?.trim() ?? '',
        value: String(a.value ?? ''),
        type: a.type as TokenAttributeType,
        tokenAttributes: a.tokenAttributes
      }));

      this.syncDataSource();
      this.emitAttributes();

      this.tabIndex = 0; // back to Tokens tab
      this.error = null;
    } catch (err: any) {
      this.error = err?.message || 'Failed to parse JSON.';
    }
  }

  private syncDataSource(): void {
    this.dataSource.data = this.attributes ?? [];
  }

  public emitAttributes(): void {
    this.attributesChange.emit(this.attributes);
  }

  public jsonArrayPreview(element: TokenAttribute): string {
    const arr: TokenAttribute[] = element.tokenAttributes == null ? [] : element.tokenAttributes;
    return arr.length === 0 ? '[] (empty)' : `[${arr.length} items]`;
  }

  private isParsableJsonArray(value: string | null | undefined): boolean {
    if (!value?.trim()) return false;
    try {
      const v = JSON.parse(value);
      return Array.isArray(v);
    } catch { return false; }
  }

}
