import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';

import { TokenAttributeType } from '../../../models/token-attribute-type';
import { TokenAttribute } from '../../../models/token-attribute';

@Component({
  standalone: true,
  selector: 'app-repeatable-editor',
  templateUrl: './repeatable-row-editor.component.html',
  styleUrls: ['./repeatable-row-editor.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatOptionModule,
    MatDialogModule,
    MatChipsModule,
    MatDividerModule,
    MatCardModule,
    MatTabsModule,
    FormsModule
  ],
})
export class RepeatableRowEditorComponent implements OnInit {
  /** Inputs */
  @Input() public tokenAttrs: TokenAttribute[] = [];
  @Input() public repeatableToken!: TokenAttribute;

  @Output() public repeatableTokenChange = new EventEmitter<TokenAttribute>();

  jsonArrayAttrs: TokenAttribute[] = [];
  form!: FormGroup;

  ngOnInit(): void {
    this.jsonArrayAttrs = this.tokenAttrs.filter(
      (t) => t.type == TokenAttributeType.JSON_ARRAY
    );
  }

  onTokenChange() {
    this.repeatableTokenChange.emit(this.repeatableToken);
  }

  compareByName = (a: any, b: any) => {
    return a && b ? a.name === b.name : a === b;
  };
}
