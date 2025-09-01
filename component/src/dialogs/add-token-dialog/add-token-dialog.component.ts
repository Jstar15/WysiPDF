import {Component, Inject, OnInit} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import {TokenAttribute} from "../../models/TokenAttribute";
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {MatFormField, MatLabel} from "@angular/material/input";

interface DialogData {
  data: TokenAttribute[];
}
@Component({
    selector: 'app-attribute-select-dialog',
    templateUrl: './add-token-dialog.component.html',
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
  ],
    styleUrls: ['./add-token-dialog.component.scss']
})
export class AddTokenDialogComponent implements OnInit {
  selectedType: TokenAttribute;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit() {
  }

  onSave():TokenAttribute {
    return this.selectedType;
  }

  canSave(): boolean{
    if(this.selectedType != null){
      return false;
    }
    return true;
  }
}
