import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

/** ⬇️ Adjust this import path/class name to your project if needed */
import { ColorPickerComponent } from '../color-picker/color-picker.component';

@Component({
  selector: 'app-color-swatch-picker',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, ColorPickerComponent],
  templateUrl: './color-swatch-picker.component.html',
  styleUrls: ['./color-swatch-picker.component.scss'],
})
export class ColorSwatchPickerComponent {
  /** Currently selected color (for highlighting) */
  @Input() public color: string = '#000000';

  /** Your custom palette (shown above defaults) */
  @Input() public customPalette: string[] = [];

  /** Show the bottom fine-tune color picker (default: true) */
  @Input() public showBottomPicker: boolean = true;

  /** Emit chosen color on click or picker change */
  @Output() public readonly colorSelect = new EventEmitter<string>();

  /** Let parent close the overlay (optional control) */
  @Output() public readonly close = new EventEmitter<void>();

  /** Curated default rows */
  public readonly defaultPalettes: string[][] = [

  ];

  public trackByIndex(i: number): number { return i; }

  public pick(hex: string): void {
    this.colorSelect.emit(hex.toUpperCase());
  }

  public onClose(): void {
    this.close.emit();
  }
}
