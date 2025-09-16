import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import {ICON_NAMES, ICON_SVGS, IconName} from "../assets/icon-contents";

@Injectable({
  providedIn: 'root',
})
export class IconService {
  // Default icon set comes from the generated names
  private icons: IconName[] = [...ICON_NAMES];

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {}

  /**
   * Registers all icons (or a subset if provided) using the inlined SVG contents.
   * @param overrideIcons optional subset of icon names to register instead of all
   */
  public registerIcons(overrideIcons?: IconName[]): void {
    const toRegister = overrideIcons && overrideIcons.length ? Array.from(new Set(overrideIcons)) : this.icons;

    for (const iconName of toRegister) {
      const svg = ICON_SVGS[iconName];
      if (!svg) {
        console.warn(`Icon SVG not found for "${iconName}" in ICON_SVGS.`);
        continue;
      }
      this.matIconRegistry.addSvgIconLiteral(
        iconName,
        this.domSanitizer.bypassSecurityTrustHtml(svg)
      );
    }
  }
}
