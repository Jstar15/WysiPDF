import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef
} from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatInput, MatLabel } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatButtonToggleGroup, MatButtonToggle } from '@angular/material/button-toggle';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import {Cell, ImageBlock, PageAttrs} from '../../../models/page';
import { TokenAttribute } from '../../../models/token-attribute';
import { TokenAttributeType } from '../../../models/token-attribute-type';
import { NgxImageCompressService } from "ngx-image-compress";
import { IconPickerComponent } from "../../../shared/icon-picker/icon-picker.component";
import { ICON_SVGS } from "../../../assets/icon-contents";
import { SvgToPngService } from "../../../services/svg-to-png.service";
import { ColorSwatchPickerComponent } from "../../../shared/color-swatch-picker/color-swatch-picker.component";

type Align = 'left' | 'center' | 'right';

@Component({
  selector: 'app-image-editor',
  standalone: true,
  templateUrl: './image-editor.component.html',
  styleUrls: ['./image-editor.component.scss'],
  imports: [
    CommonModule, FormsModule, NgIf, NgFor,
    MatFormField, MatInput, MatLabel,
    MatIcon, MatButton, MatButtonToggleGroup, MatButtonToggle,
    MatSelect, MatOption, IconPickerComponent, ColorSwatchPickerComponent,
    MatIconButton, MatMenu, MatMenuTrigger
  ]
})
export class AddImageEditorComponent implements OnInit, OnChanges {
  @Input() public cell!: Cell;
  @Input() public tokenAttrs: TokenAttribute[] = [];
  @Input() public pageAttrs: PageAttrs = {};
  @Input() public colorAttrs: string[] = [];
  @Output() public change = new EventEmitter<Cell>();

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;

  public imageBase64 = '';
  public filename = '';
  public width = 100;
  public alignment: Align = 'left';
  public imageTokens: TokenAttribute[] = [];
  public selectedTokenKey: string | null = null;

  /** Icon picker state */
  public showIconPicker = false;
  public color: string = 'black';

  constructor(private imageCompressService: NgxImageCompressService,
              private svgToPngService: SvgToPngService,
              ) {}

  ngOnInit(): void { this.hydrateFromInputs(); }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cell'] || changes['tokenAttrs']) this.hydrateFromInputs();
  }

  // ── File Picker ─────────────────────────────
  async openFilePicker(): Promise<void> {
    let maxMb: number = 5;
    if(this.pageAttrs.autoCompressImages){
      maxMb = this.pageAttrs.maxImageSize;
    }

    try {
      const selected = await this.imageCompressService.uploadFileOrReject();
      const result = await this.imageCompressService.getImageWithMaxSizeAndMetas(
        { image: selected.image, orientation: selected.orientation, fileName: selected.fileName },
        maxMb,
        true
      );
      this.imageBase64 = result.image;
      this.filename = result.fileName ?? selected.fileName ?? '';
      this.selectedTokenKey = null;
      this.emitPayload();
    } catch (err: any) {
      console.warn('Image pick/compress aborted:', err?.message ?? err);
    }
  }

  // ── Token Picker ───────────────────────────
  onTokenChanged(): void {
    if (this.selectedTokenKey) {
      this.filename = `[token:${this.selectedTokenKey}]`;
      this.previewFromTokenIfPossible();
    }
    this.emitPayload();
  }

  // ── Width & Alignment ──────────────────────
  onWidthChanged(v: number | string): void {
    const n = Number(v);
    if (Number.isFinite(n)) this.width = this.clampWidth(n);
    this.emitPayload();
  }
  onAlignmentChanged(): void { this.emitPayload(); }

  // ── Icon Picker ───────────────────────────
  openIconPicker(): void { this.showIconPicker = true; }

  handleIconOk(selectedIcon: string): void {
    this.showIconPicker = false;
    this.filename = `[icon:${selectedIcon}]`;
    this.selectedTokenKey = null;

    const svg = ICON_SVGS[selectedIcon];
    if (svg) {
      // Make a copy and apply the selected color
      const coloredSvg = svg.replace(/\sfill="[^"]*"/g, '').replace(
        /<svg([^>]*)>/,
        `<svg$1 fill="${this.color}">`
      );

      this.svgToPngService.svgToPng(coloredSvg, 128, 128)
        .then(pngBase64 => {
          this.imageBase64 = pngBase64;
          this.emitPayload();
        })
        .catch(err => console.error('Failed to convert SVG to PNG', err));
    } else {
      this.imageBase64 = '';
      this.emitPayload();
    }
  }

  handleIconCancel(): void { this.showIconPicker = false; }

  // ── Color Picker ──────────────────────────
  openColorPicker(): void {
    // This can trigger the menu or any other UI logic if needed
    // In your HTML, the mat-menu is already bound to the button
  }

  onColorSelected(newColor: string): void {
    this.color = newColor;

    // Reapply color if an icon is selected
    if (this.filename.startsWith('[icon:')) {
      const iconName = this.filename.replace(/\[icon:(.*)\]/, '$1');
      const svg = ICON_SVGS[iconName];
      if (svg) {
        const coloredSvg = svg.replace(/\sfill="[^"]*"/g, '').replace(
          /<svg([^>]*)>/,
          `<svg$1 fill="${this.color}">`
        );
        this.svgToPngService.svgToPng(coloredSvg, 128, 128)
          .then(pngBase64 => {
            this.imageBase64 = pngBase64;
            this.emitPayload();
          })
          .catch(err => console.error('Failed to convert SVG to PNG', err));
      }
    }
  }

  // ── Internal Helpers ──────────────────────
  private hydrateFromInputs(): void {
    this.imageTokens = (this.tokenAttrs ?? []).filter(t => t.type === TokenAttributeType.IMAGE);

    const ib: ImageBlock | undefined = this.cell?.imageBlock;
    if (ib?.imageBase64) this.imageBase64 = ib.imageBase64;
    if (ib?.filename) this.filename = ib.filename;

    this.width = this.clampWidth(ib?.width ?? this.width ?? 100);
    this.alignment = (ib?.alignment as Align) ?? this.alignment;

    const tokenKey = (ib as any)?.HtmlTokenElement?.key as string | undefined;
    if (tokenKey) this.selectedTokenKey = tokenKey;

    if (this.selectedTokenKey) this.previewFromTokenIfPossible();
    this.emitPayload();
  }

  private previewFromTokenIfPossible(): void {
    const token = this.imageTokens.find(t => t.name === this.selectedTokenKey);
    if (!token) return;
    const value = String(token.value ?? '').trim();
    if (this.isDataUrl(value) || this.isHttpUrl(value)) this.imageBase64 = value;
  }

  private emitPayload(): void {
    const imageBlock: ImageBlock = {
      imageBase64: this.imageBase64 || '',
      filename: this.filename || (this.selectedTokenKey ? `[token:${this.selectedTokenKey}]` : ''),
      width: this.width,
      alignment: this.alignment,
      ...(this.selectedTokenKey ? { HtmlTokenElement: { key: this.selectedTokenKey, type: 'image' } } : {})
    } as ImageBlock;

    const updated: Cell = { ...this.cell, imageBlock };
    updated.type = 'image';
    this.change.emit(updated);
  }

  private clampWidth(n: number): number { return Math.min(100, Math.max(1, Math.round(n))); }
  private isDataUrl(v: string): boolean { return /^data:image\/[a-zA-Z]+;base64,/.test(v); }
  private isHttpUrl(v: string): boolean { return /^https?:\/\//i.test(v); }
}
