import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { SnackbarType } from '../components/snackbar/snackbar.component';
import { DEFAULT } from '../constants/defaults.constant';

interface SnackbarState {
    message: string;
    type: SnackbarType;
    show: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class SnackbarService {
    private readonly defaultDuration = DEFAULT.snackbarDuration;
    private readonly state = new BehaviorSubject<SnackbarState>({
        message: '',
        type: DEFAULT.snackbarType,
        show: false,
    });

    private timeoutId: number | null = null;

    readonly state$ = this.state.asObservable();

    private show(message: string, type: SnackbarType = 'info', duration: number = this.defaultDuration): void {
        // Clear any existing timeout
        if (this.timeoutId !== null) {
            window.clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }

        // Hide current snackbar to reset animation
        this.hide();

        // Use setTimeout to ensure the hide animation completes before showing new message
        setTimeout(() => {
            // Update state with new message
            this.state.next({ message, type, show: true });

            // Set new timeout
            this.timeoutId = window.setTimeout(() => {
                this.hide();
                this.timeoutId = null;
            }, duration);
        }, 300); // Wait for hide animation to complete
    }

    hide(): void {
        this.state.next({ ...this.state.value, show: false });
    }

    success(message: string, duration?: number): void {
        this.show(message, 'success', duration);
    }

    error(message: string, duration?: number): void {
        this.show(message, 'error', duration);
    }

    warning(message: string, duration?: number): void {
        this.show(message, 'warning', duration);
    }

    info(message: string, duration?: number): void {
        this.show(message, 'info', duration);
    }
}
