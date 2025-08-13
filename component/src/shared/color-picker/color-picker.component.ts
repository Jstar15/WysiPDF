import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild
} from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ColorPickerOverlayComponent } from './color-picker-overlay.component';

@Component({
  selector: 'app-color-picker',
  standalone: true,
  template: `
    <div #trigger
         class="color-box"
         [style.background]="color"
         (click)="openPicker()">
    </div>
  `,
  styles: [`
    .color-box {
      width: 32px;
      height: 32px;
      border-radius: 4px;
      border: 1px solid #ccc;
      cursor: pointer;
    }
  `]
})
export class ColorPickerComponent {
  @Input() color: string = '#ffffff';
  @Output() colorChange = new EventEmitter<string>();

  @ViewChild('trigger', { static: true }) trigger!: ElementRef;
  private overlayRef?: OverlayRef;

  constructor(private overlay: Overlay) {}

  openPicker(): void {
    if (this.overlayRef) {
      this.overlayRef.detach();
    }

    const positionStrategy = this.overlay.position()
        .flexibleConnectedTo(this.trigger)
        .withPositions([{
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top'
        }])
        .withFlexibleDimensions(false)
        .withPush(false);

    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'transparent-backdrop',
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition()
    });

    const portal = new ComponentPortal(ColorPickerOverlayComponent);
    const componentRef = this.overlayRef.attach(portal);
    const instance = componentRef.instance as ColorPickerOverlayComponent;

    instance.color = this.color;
    instance.colorChange.subscribe((newColor: string) => {
      this.color = newColor;
      this.colorChange.emit(newColor);
    });

    this.overlayRef.backdropClick().subscribe(() => this.overlayRef?.detach());
  }
}
