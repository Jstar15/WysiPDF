import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ColorPickerOverlayComponent} from "../../../shared/color-picker/color-picker-overlay.component";
import {FormsModule} from "@angular/forms";
import {MatInput, MatLabel} from "@angular/material/input";
import {MatFormField} from "@angular/material/form-field";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {PageAttrs} from "../../../models/page";
import {MatDialogContent} from "@angular/material/dialog";
import {MatSlideToggle} from "@angular/material/slide-toggle";

@Component({
  selector: 'app-page-layout-editor',
  standalone: true,
  imports: [CommonModule, ColorPickerOverlayComponent, FormsModule, MatFormField, MatInput, MatLabel, MatDialogContent, MatSlideToggle],
  templateUrl: './page-layout-editor.component.html',
  styleUrls: ['./page-layout-editor.component.scss']
})
export class PageLayoutEditorComponent {

  @Input() pageAttrs : PageAttrs = {}

  showBgPicker = false;

  constructor() {}


}
