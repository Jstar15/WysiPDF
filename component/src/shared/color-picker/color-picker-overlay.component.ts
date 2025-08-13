import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ColorChromeModule } from 'ngx-color/chrome';

@Component({
    selector: 'app-color-picker-overlay',
    standalone: true,
    imports: [ColorChromeModule],
    template: `
        <div style="background: white; border: 1px solid #ccc; padding: 8px; border-radius: 4px;">
            <color-chrome
                    [color]="color"
                    (onChangeComplete)="colorChange.emit($event.color.hex)">
            </color-chrome>
        </div>
    `
})
export class ColorPickerOverlayComponent {
    @Input() color: string = '#ffffff';
    @Output() colorChange = new EventEmitter<string>();
}
