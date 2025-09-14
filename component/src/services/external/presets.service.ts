import { Injectable } from '@angular/core';
import { Page } from '../../models/page';

// Explicit imports
import { Preset1 } from '../../presets/1.preset';
import { Preset2 } from '../../presets/2.preset';
import { Preset3 } from '../../presets/3.preset';
import { Preset4 } from '../../presets/4.preset';
import { Preset5 } from '../../presets/5.preset';

// keep adding as you create them…

@Injectable({
  providedIn: 'root'
})
export class PresetsService {
  private presets: Page[] = [
    Preset1,
    Preset2,
    Preset3,
    Preset4,
    Preset5
  ];

  getPreset(index: number): Page | undefined {
    return this.presets[index];
  }

  getAllPresets(): Page[] {
    return this.presets;
  }
}
