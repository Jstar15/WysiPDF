import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import hljs from 'highlight.js/lib/core';
import json from 'highlight.js/lib/languages/json';
import { MatIcon } from '@angular/material/icon';
import { NgForOf, NgIf } from '@angular/common';
import {MatIconButton} from "@angular/material/button";
import {MatTooltip} from "@angular/material/tooltip";

hljs.registerLanguage('json', json);

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
    const jsonStr = JSON.stringify(this.currentJson?.data || {}, null, 2);
    const highlighted = hljs.highlight(jsonStr, { language: 'json' }).value;
    this.lines = highlighted.split('\n');
  }

  copy(): void {
    navigator.clipboard.writeText(JSON.stringify(this.currentJson?.data, null, 2));
  }
}

export interface JsonListItem {
  name: string;
  description?: string;
  data: any;
}
