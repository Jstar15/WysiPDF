import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogActions
} from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatInput, MatLabel } from "@angular/material/input";
import { FormsModule } from "@angular/forms";
import { MatButton } from "@angular/material/button";
import { NgIf, NgFor } from "@angular/common";
import { MatButtonToggle, MatButtonToggleGroup } from "@angular/material/button-toggle";
import { MatIcon } from "@angular/material/icon";
import { MatSelect } from "@angular/material/select";
import { MatOption } from "@angular/material/core";

import { ImageBlock } from "../../models/interfaces";
import { TokenAttribute } from "../../models/TokenAttribute";
import { TokenAttributeTypeEnum } from "../../models/TokenAttributeTypeEnum";

export interface AddImageDialogPayload {
  imageBlock: ImageBlock;
  tokenAttrs: TokenAttribute[];
}

@Component({
  selector: 'app-add-image-dialog',
  templateUrl: './add-image-dialog.component.html',
  styleUrls: ['./add-image-dialog.component.scss'],
  standalone: true,
  imports: [
    // Angular
    FormsModule, NgIf, NgFor,

    // Material (standalone)
    MatDialogTitle, MatDialogActions,
    MatFormField, MatInput, MatLabel,
    MatButton, MatIcon,
    MatButtonToggleGroup, MatButtonToggle,
    MatSelect, MatOption
  ]
})
export class AddImageDialogComponent implements OnInit {
  // Existing state
  public imageBase64: string = '';
  public filename: string = '';
  public width: number = 100;
  public alignment: 'left' | 'center' | 'right' = 'left';

  // New: token selection state
  public imageTokens: TokenAttribute[] = [];
  public selectedTokenKey: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<ImageBlock, ImageBlock>,
    @Inject(MAT_DIALOG_DATA) public data: AddImageDialogPayload
  ) {}

  public ngOnInit(): void {
    // Filter only IMAGE tokens
    this.imageTokens = (this.data?.tokenAttrs || []).filter(
      t => t.type === TokenAttributeTypeEnum.IMAGE
    );

    if (this.data?.imageBlock) {
      const ib = this.data.imageBlock;
      this.imageBase64 = ib.imageBase64 || '';
      this.filename = ib.filename || '';
      this.width = ib.width ?? 100;
      this.alignment = ib.alignment || 'left';

      // Init token selection if present
      const tokenKey = (ib as any)?.HtmlTokenElement?.key as string | undefined;
      if (tokenKey) {
        this.selectedTokenKey = tokenKey;
        this.applyTokenSelection(); // attempt preview from token value if possible
      }
    }
  }

  public onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.imageBase64 = reader.result as string;
      this.filename = file.name;

      // If a file was chosen, clear token selection
      this.selectedTokenKey = null;
    };
    reader.readAsDataURL(file);
  }

  public onTokenChanged(): void {
    // Clear any file-based image when switching to token
    if (this.selectedTokenKey) {
      this.filename = `[token:${this.selectedTokenKey}]`;
      // Attempt preview
      this.applyTokenSelection();
    } else {
      // No token selected -> keep existing file preview (if any)
    }
  }

  private applyTokenSelection(): void {
    const token = this.imageTokens.find(t => t.name === this.selectedTokenKey);
    if (!token) return;

    const v = token.value?.trim() || '';

    // If the token value is a data URL or an http(s) URL, we can preview directly.
    if (this.isDataUrl(v) || this.isHttpUrl(v)) {
      this.imageBase64 = v;
    } else {
      // Not previewable (e.g., raw base64 without mime prefix) — allow save anyway.
      this.imageBase64 = '';
    }
  }

  private isDataUrl(v: string): boolean {
    return /^data:image\/[a-zA-Z]+;base64,/.test(v);
  }

  private isHttpUrl(v: string): boolean {
    return /^https?:\/\//i.test(v);
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  public onSave(): void {
    // Build result object
    const result: ImageBlock = {
      imageBase64: this.imageBase64 || '',
      filename: this.filename || (this.selectedTokenKey ? `[token:${this.selectedTokenKey}]` : ''),
      width: this.width,
      alignment: this.alignment,
      // Save the token link if chosen
      ...(this.selectedTokenKey
        ? { HtmlTokenElement: { key: this.selectedTokenKey, type: 'image' } }
        : {})
    } as ImageBlock;

    this.dialogRef.close(result);
  }

  // Button enablement: allow save if either a file is chosen (imageBase64) OR a token is selected
  public canSave(): boolean {
    return !!this.imageBase64 || !!this.selectedTokenKey;
  }
}
