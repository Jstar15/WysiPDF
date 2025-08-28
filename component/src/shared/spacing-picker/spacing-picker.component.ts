import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface SpacingValues {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * SpacingPicker
 * - Visual cross editor for padding/margin.
 * - Buffers changes locally; emits only when OK is pressed.
 * - Matches the "picker-surface" look/feel you shared.
 *
 * Two-way outputs provided per side, emitted on OK:
 *   [top], (topChange); [right], (rightChange); [bottom], (bottomChange); [left], (leftChange)
 *
 * Parent can listen to (confirm) for the full object and then close the overlay.
 */
@Component({
  selector: 'app-spacing-picker',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './spacing-picker.component.html',
  styleUrls: ['./spacing-picker.component.scss'],
})
export class SpacingPickerComponent implements OnChanges {
  // Title (e.g., 'Padding' or 'Margin')
  @Input() public title: string = 'Padding';

  // Inputs (initial values)
  @Input() public top: number = 0;
  @Input() public right: number = 0;
  @Input() public bottom: number = 0;
  @Input() public left: number = 0;

  // Per-side change outputs (emitted on OK)
  @Output() public readonly topChange = new EventEmitter<number>();
  @Output() public readonly rightChange = new EventEmitter<number>();
  @Output() public readonly bottomChange = new EventEmitter<number>();
  @Output() public readonly leftChange = new EventEmitter<number>();

  // Aggregate confirm + optional cancel
  @Output() public readonly confirm = new EventEmitter<SpacingValues>();
  @Output() public readonly cancel = new EventEmitter<void>();

  // Local draft values (for editing without committing)
  public draft: SpacingValues = { top: 0, right: 0, bottom: 0, left: 0 };

  public ngOnChanges(changes: SimpleChanges): void {
    // Sync drafts if parent updates inputs
    if (changes['top'] || changes['right'] || changes['bottom'] || changes['left']) {
      this.draft = {
        top: this.sanitize(this.top),
        right: this.sanitize(this.right),
        bottom: this.sanitize(this.bottom),
        left: this.sanitize(this.left),
      };
    }
  }

  public nudge(side: keyof SpacingValues, delta: number): void {
    const next = this.sanitize((this.draft[side] ?? 0) + delta);
    this.draft = { ...this.draft, [side]: next };
  }

  public onInput(side: keyof SpacingValues, value: string | number): void {
    const num = typeof value === 'number' ? value : Number(value);
    this.draft = { ...this.draft, [side]: this.sanitize(num) };
  }

  public onOk(): void {
    // Emit per-side changes (to support two-way binding)
    this.topChange.emit(this.draft.top);
    this.rightChange.emit(this.draft.right);
    this.bottomChange.emit(this.draft.bottom);
    this.leftChange.emit(this.draft.left);

    // Emit aggregate payload
    this.confirm.emit({ ...this.draft });
  }

  public onCancel(): void {
    this.cancel.emit();
  }

  private sanitize(n: number): number {
    if (Number.isNaN(n) || n === null || n === undefined) return 0;
    // Clamp to a sane range; tweak as you like
    return Math.max(0, Math.min(9999, Math.round(n)));
  }


}
