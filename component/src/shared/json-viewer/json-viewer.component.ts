import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import hljs from 'highlight.js/lib/core';
import json from 'highlight.js/lib/languages/json';
import javascript from 'highlight.js/lib/languages/javascript';
import { MatIcon } from '@angular/material/icon';
import { NgForOf, NgIf } from '@angular/common';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';

hljs.registerLanguage('json', json);
hljs.registerLanguage('javascript', javascript);

@Component({
  selector: 'app-json-viewer',
  templateUrl: './json-viewer.component.html',
  styleUrls: ['./json-viewer.component.scss'],
  standalone: true,
  imports: [MatIcon, NgForOf, NgIf, MatIconButton, MatTooltip]
})
export class JsonViewerComponent implements OnChanges {
  @Input() jsonList: JsonListItem[] = [];

  currentIndex = 0;
  lines: string[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['jsonList']) {
      this.currentIndex = 0;
      this.updateLines();
    }
  }

  get currentJson() {
    return this.jsonList?.[this.currentIndex];
  }

  get canGoPrev(): boolean {
    return this.currentIndex > 0;
  }

  get canGoNext(): boolean {
    return this.currentIndex < this.jsonList.length - 1;
  }

  prev(): void {
    if (this.canGoPrev) {
      this.currentIndex--;
      this.updateLines();
    }
  }

  next(): void {
    if (this.canGoNext) {
      this.currentIndex++;
      this.updateLines();
    }
  }

  updateLines(): void {
    const data = this.currentJson?.data;

    if (data == null) {
      this.lines = [];
      return;
    }

    // STRING path: treat like console.log output and highlight as JavaScript
    if (typeof data === 'string') {
      const pretty = this.asConsoleString(data); // remove \" and \n, turn into real chars
      let highlighted: string;
      try {
        highlighted = hljs.highlight(pretty, { language: 'javascript' }).value;
      } catch {
        highlighted = this.escapeHtml(pretty);
      }
      this.lines = highlighted.split('\n');
      return;
    }

    // OBJECT path: pretty JSON; stringify functions to their source for visibility
    const jsonStr = JSON.stringify(
      data,
      (k, v) => (typeof v === 'function' ? v.toString() : v),
      2
    );
    const highlighted = hljs.highlight(jsonStr, { language: 'json' }).value;
    this.lines = highlighted.split('\n');
  }

  copy(): void {
    const data = this.currentJson?.data;

    let text: string;

    if (typeof data === 'string') {
      // Make the string look like console.log output (no backslash escapes)
      text = this.asConsoleString(data);
    } else {
      // Safe pretty JSON for objects
      text = JSON.stringify(
        data,
        (k, v) => (typeof v === 'function' ? v.toString() : v),
        2
      );
    }

    navigator.clipboard.writeText(text);
  }

  /**
   * Convert a possibly double-escaped JSON-ish string into the raw form
   * that console.log would show (real quotes/newlines, no backslashes).
   */
  private asConsoleString(raw: string): string {
    if (raw == null) return '';

    let s = String(raw).trim();

    // If it’s a quoted JSON literal, unescape via JSON.parse first
    if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
      try {
        s = JSON.parse(s);
      } catch {
        // Fallback: strip wrappers and unescape manually
        s = s.slice(1, -1);
      }
    }

    // Unescape common sequences (handles double-escaped content too)
    const unescapeOnce = (x: string) =>
      x
        // reduce \\ -> \ first so \" becomes " on next step
        .replace(/\\\\/g, '\\')
        .replace(/\\"/g, '"')
        .replace(/\\'/g, "'")
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\r')
        .replace(/\\t/g, '\t')
        .replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));

    for (let i = 0; i < 3; i++) {
      const next = unescapeOnce(s);
      if (next === s) break;
      s = next;
    }

    // Remove any leftover escapes that only precede quotes
    s = s.replace(/\\(?=["'])/g, '');
    s = s.replaceAll('"",', '"\n"');
    return s;
  }

  private escapeHtml(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

export interface JsonListItem {
  name: string;
  description?: string;
  data: any;
}
