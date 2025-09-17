import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import { FormsModule } from "@angular/forms";
import { NgForOf } from "@angular/common";
import { MatButton } from "@angular/material/button";
import { MatOption } from "@angular/material/core";
import { MatSelect } from "@angular/material/select";
import { MatFormField, MatLabel } from "@angular/material/input";
import {PageNumberType} from "../../shared/quill-wrapper/PageNumberingElementBlot";


interface DialogData {
  selected?: PageNumberType;
}

@Component({
  selector: 'app-page-numbering-select-dialog',
  templateUrl: './add-page-numbering-dialog.component.html',
  styleUrls: ['./add-page-numbering-dialog.component.scss'],
  standalone: true,
  imports: [
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    FormsModule,
    NgForOf,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent
  ]
})
export class PageNumberingSelectDialogComponent {
  PageNumberType = PageNumberType; // expose enum to template
  selectedType: PageNumberType | null = null;

  pageNumberOptions = [
    { label: 'Current Page Number', value: PageNumberType.CurrentPageNumber },
    { label: 'Total Page Number', value: PageNumberType.TotalPageNumber }
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    if (data?.selected) {
      this.selectedType = data.selected;
    }
  }

  onSave(): PageNumberType | null {
    return this.selectedType;
  }

  canSave(): boolean {
    return this.selectedType == null;
  }
}
