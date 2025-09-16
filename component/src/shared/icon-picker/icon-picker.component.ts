import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { IconService } from "../../services/icon.service";
import { ICON_NAMES, ICON_SVGS, IconName } from "../../assets/icon-contents";

@Component({
  selector: 'app-icon-picker',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './icon-picker.component.html',
  styleUrls: ['./icon-picker.component.scss'],
})
export class IconPickerComponent implements OnInit {
  @Input() title: string = 'Select Icon';
  @Input() selected: IconName | null = null;

  /** Input color applied to all icons */
  @Input() color: string = 'red';

  @Output() confirm = new EventEmitter<IconName>();
  @Output() cancel = new EventEmitter<void>();

  draftSelected: IconName | null = null;
  icons: IconName[] = [];

  /** Constructed copy of SVGs to safely modify color without touching the originals */
  private coloredSvgs: any = {};

  constructor(private iconService: IconService) {}

  ngOnInit() {
    this.iconService.registerIcons();
    this.icons = [...ICON_NAMES];
    this.draftSelected = this.selected;

    // Create a constructed copy of all SVGs and apply initial color
    for (const iconName of this.icons) {
      const originalSvg = ICON_SVGS[iconName];
      if (!originalSvg) continue;

      this.coloredSvgs[iconName] = this.applyColorToSvg(originalSvg, this.color);
    }
  }

  /** Select icon in the picker */
  selectIcon(icon: IconName) {
    this.draftSelected = icon;
  }

  isSelected(icon: IconName) {
    return this.draftSelected === icon;
  }

  /** Confirm selection */
  onOk() {
    if (this.draftSelected) this.confirm.emit(this.draftSelected);
  }

  /** Cancel selection */
  onCancel() {
    this.cancel.emit();
  }

  /** Get the SVG string for display with current color */
  getSvg(icon: IconName): string {
    const svg = this.coloredSvgs[icon] ?? ICON_SVGS[icon] ?? '';
    return this.applyColorToSvg(svg, this.color);
  }

  /** Update all SVGs when color changes */
  updateColor(newColor: string) {
    this.color = newColor;
    for (const iconName of this.icons) {
      const originalSvg = ICON_SVGS[iconName];
      if (!originalSvg) continue;
      this.coloredSvgs[iconName] = this.applyColorToSvg(originalSvg, this.color);
    }
  }

  /** Helper: applies a fill color to the SVG string */
  private applyColorToSvg(svg: string, color: string): string {
    if (!svg) return '';
    // Remove existing fill attributes
    let result = svg.replace(/\sfill="[^"]*"/g, '');
    // Inject new fill on <svg> tag
    result = result.replace(/<svg([^>]*)>/, `<svg$1 fill="${color}">`);
    return result;
  }


}
