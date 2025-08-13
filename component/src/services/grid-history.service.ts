import { Injectable } from '@angular/core';
import { Page } from '../models/interfaces';

@Injectable({ providedIn: 'root' })
export class GridHistoryService {
    private history: Page[] = [];
    private currentIndex = -1;
    private maxHistory = 50;

    pushSnapshot(snapshot: Page): void {
        const clone = structuredClone(snapshot); // deep copy to avoid mutation

        // Trim any forward history
        if (this.currentIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.currentIndex + 1);
        }

        // Limit history size
        if (this.history.length >= this.maxHistory) {
            this.history.shift();
            this.currentIndex--;
        }

        this.history.push(clone);
        this.currentIndex++;
    }

    canUndo(): boolean {
        return this.currentIndex > 0;
    }

    canRedo(): boolean {
        return this.currentIndex < this.history.length - 1;
    }

    undo(): Page | null {
        if (this.canUndo()) {
            this.currentIndex--;
            return structuredClone(this.history[this.currentIndex]);
        }
        return null;
    }

    redo(): Page | null {
        if (this.canRedo()) {
            this.currentIndex++;
            return structuredClone(this.history[this.currentIndex]);
        }
        return null;
    }

    clear(): void {
        this.history = [];
        this.currentIndex = -1;
    }
}
