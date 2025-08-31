import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms";
import {MatDialogContent,} from "@angular/material/dialog";
import {MatLabel} from "@angular/material/input";
import {MatFormField} from "@angular/material/form-field";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {Page} from "../../../../models/interfaces";
import {PresetsService} from "../../../../presets/presets.service";

@Component({
  selector: 'app-preset-loader',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormField, MatLabel, MatOption, MatSelect, MatDialogContent],
  templateUrl: './preset-loader.component.html',
  styleUrls: ['./preset-loader.component.scss']
})
export class PresetLoaderComponent implements OnInit{
  presets: Page[] = [];
  selectedPreset?: Page;

  @Output() pageSelected: EventEmitter<Page> = new EventEmitter<Page>(); // <-- added

  constructor(
    private presetsService: PresetsService) {}

  ngOnInit(): void {
    this.presets = this.presetsService.getAllPresets();
  }

  onSelect(selectedPreset: Page): void {
    this.pageSelected.emit(selectedPreset);
  }

}
