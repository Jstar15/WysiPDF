import { Component, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogActions, MatDialogTitle } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { QuillWrapperComponent } from '../../shared/quill-wrapper/quill-wrapper.component';
import { TokenAttribute } from '../../models/TokenAttribute';

@Component({
  standalone: true,
  imports: [CommonModule, QuillWrapperComponent, MatButton, MatDialogActions, MatDialogTitle],
  templateUrl: './quill-editor.dialog.component.html',
  styleUrls: ['./quill-editor.dialog.component.scss']
})
export class QuillEditorDialogComponent {
  @ViewChild('wrapper') wrapper!: QuillWrapperComponent;

  html: string;
  attributeArray: TokenAttribute[];
  editorVisible: boolean = true;
  constructor(
    private dialogRef: MatDialogRef<QuillEditorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { html: string; attributes: TokenAttribute[] }
  ) {
    this.html = data.html;
    this.attributeArray = data.attributes;
  }

  cancel(): void {
    this.safeDestroyWrapper();
    // Defer close 1 macrotask to avoid racing with teardown
    this.dialogRef.close();
    this.editorVisible = false;
  }

  save(): void {
    const latest = this.html; // kept in sync by (htmlChange)
    this.safeDestroyWrapper();
    this.dialogRef.close(latest);

  }

  private safeDestroyWrapper(): void {
    try {
      this.wrapper?.destroy?.(); // call the wrapper's destroy() you implemented
          this.editorVisible = false;
    } catch {}
  }
}
