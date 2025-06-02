import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { SnackbarType } from '../components/snackbar/enumerations/snacbar-type.enum';
import { DEFAULT } from '../constants/defaults.constant';

/**
 * Snackbar state interface for internal state management
 */
interface SnackbarState {
    message: string;
    type: SnackbarType;
    show: boolean;
}

/**
 * Snackbar service for displaying toast notifications
 * Manages notification queue, timing, and different message types
 */
@Injectable({
    providedIn: 'root',
})
export class SnackbarService {
    private readonly defaultDuration = DEFAULT.snackbarDuration;
    private readonly state = new BehaviorSubject<SnackbarState>({
        message: '',
        type: SnackbarType.Success,
        show: false,
    });

    private timeoutId: number | null = null;
    private pendingMessage: { message: string; type: SnackbarType; duration: number } | null = null;

    /** Observable stream of snackbar state changes */
    readonly state$ = this.state.asObservable();

    /**
     * Shows a snackbar with the specified message and type
     * @param message - The message to display
     * @param type - The snackbar type (success, error, warning, info)
     * @param duration - How long to show the snackbar in milliseconds
     * @private
     */
    private show(
        message: string,
        type: SnackbarType = SnackbarType.Info,
        duration: number = this.defaultDuration,
    ): void {
        // If there's already a snackbar showing, queue this message
        if (this.state.value.show) {
            this.pendingMessage = { message, type, duration };
            this.hide();
            return;
        }

        // Clear any existing timeout
        if (this.timeoutId !== null) {
            window.clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }

        // Show new snackbar
        this.state.next({ message, type, show: true });

        // Set new timeout
        this.timeoutId = window.setTimeout(() => {
            this.hide();
            this.timeoutId = null;
        }, duration);
    }

    /**
     * Hides the current snackbar and shows any pending message
     */
    hide(): void {
        if (this.timeoutId !== null) {
            window.clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }

        // Hide current snackbar
        this.state.next({ ...this.state.value, show: false });

        // If there's a pending message, show it after a short delay
        if (this.pendingMessage) {
            const { message, type, duration } = this.pendingMessage;
            this.pendingMessage = null;

            // Wait for hide animation to complete before showing new message
            setTimeout(() => {
                this.show(message, type, duration);
            }, 200);
        }
    }

    /**
     * Shows a success message snackbar
     * @param message - The success message to display
     * @param duration - Optional custom duration in milliseconds
     */
    success(message: string, duration?: number): void {
        this.show(message, SnackbarType.Success, duration);
    }

    /**
     * Shows an error message snackbar
     * @param message - The error message to display
     * @param duration - Optional custom duration in milliseconds
     */
    error(message: string, duration?: number): void {
        this.show(message, SnackbarType.Error, duration);
    }

    /**
     * Shows a warning message snackbar
     * @param message - The warning message to display
     * @param duration - Optional custom duration in milliseconds
     */
    warning(message: string, duration?: number): void {
        this.show(message, SnackbarType.Warning, duration);
    }

    /**
     * Shows an info message snackbar
     * @param message - The info message to display
     * @param duration - Optional custom duration in milliseconds
     */
    info(message: string, duration?: number): void {
        this.show(message, SnackbarType.Info, duration);
    }
}
