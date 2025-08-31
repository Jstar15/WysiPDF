import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ColorPickerOverlayComponent} from "../../../../shared/color-picker/color-picker-overlay.component";
import {FormsModule} from "@angular/forms";
import {MatInput, MatLabel} from "@angular/material/input";
import {MatFormField} from "@angular/material/form-field";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {PageAttrs} from "../../../../models/interfaces";
import {MatDialogContent} from "@angular/material/dialog";

@Component({
  selector: 'app-page-layout-editor',
  standalone: true,
  imports: [CommonModule, ColorPickerOverlayComponent, FormsModule, MatFormField, MatInput, MatLabel, MatOption, MatSelect, MatDialogContent],
  templateUrl: './page-layout-editor.component.html',
  styleUrls: ['./page-layout-editor.component.scss']
})
export class PageLayoutEditorComponent {

  @Input() pageAttrs : PageAttrs = {}

  showBgPicker = false;

  availableFonts: string[] = [
    'Raleway',
    'Roboto',
    'Nunito',
    'Cormorant'
  ];

  constructor() {}


}
