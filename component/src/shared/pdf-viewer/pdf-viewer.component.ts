import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss']
})
export class PdfViewerComponent {
  sanitizedSrc: SafeResourceUrl | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  @Input() set base64(value: string) {
    if (value) {
      this.sanitizedSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
          this.toPdfDataUrl(value)
      );
    }
  }

  private toPdfDataUrl(base64: string): string {
    return `data:application/pdf;base64,${base64}`;
  }
}
