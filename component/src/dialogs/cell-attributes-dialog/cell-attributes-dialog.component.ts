import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule }  from '@angular/material/button';
import { MatIconModule }    from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }   from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { ColorPickerComponent } from '../../shared/color-picker/color-picker.component';


@Component({
  selector: 'app-cell-attributes-dialog',
  standalone: true,
  templateUrl: './cell-attributes-dialog.component.html',
  styleUrls: ['./cell-attributes-dialog.component.scss'],
  imports: [
    CommonModule, FormsModule,
    MatDialogModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatDividerModule,
    ColorPickerComponent
  ]
})
export class CellAttributesDialogComponent {
  showBorderPicker = false;
  showBgPicker = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CellAttributesDialogComponent>
  ) {}

  onCancel() { this.dialogRef.close(); }
  onSave()   { this.dialogRef.close(this.data); }
}
