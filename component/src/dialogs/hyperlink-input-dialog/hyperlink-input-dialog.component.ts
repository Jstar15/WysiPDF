import {Component, OnInit} from '@angular/core';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-hyperlink-input-dialog',
  templateUrl: './hyperlink-input-dialog.component.html',
  imports: [
    MatFormField,
    MatDialogContent,
    MatDialogTitle,
    MatInput,
    MatFormField,
    MatLabel,
    MatDialogActions,
    MatButton,
    FormsModule,
    MatDialogClose
  ],
  styleUrls: ['./hyperlink-input-dialog.component.scss']
})
export class HyperlinkInputDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<HyperlinkInputDialogComponent>) { }

  hyperLinkPayload: HyperLinkDialogPayload;
  ngOnInit(): void {
    this.hyperLinkPayload = {text: "", url: "http://"};
  }

  isDisabled(){
    if(this.hyperLinkPayload.text.trim().length > 0 && this.hyperLinkPayload.url.trim().length > 0){
      return false;
    }
    return true;
  }
}

export interface HyperLinkDialogPayload {
  text: string;
  url: string;
}
