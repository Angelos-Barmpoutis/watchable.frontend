import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { SnackbarType } from '../components/snackbar/enumerations/snacbar-type.enum';
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
        type: SnackbarType.Success,
        show: false,
    });

    private timeoutId: number | null = null;
    private pendingMessage: { message: string; type: SnackbarType; duration: number } | null = null;

    readonly state$ = this.state.asObservable();

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

    success(message: string, duration?: number): void {
        this.show(message, SnackbarType.Success, duration);
    }

    error(message: string, duration?: number): void {
        this.show(message, SnackbarType.Error, duration);
    }

    warning(message: string, duration?: number): void {
        this.show(message, SnackbarType.Warning, duration);
    }

    info(message: string, duration?: number): void {
        this.show(message, SnackbarType.Info, duration);
    }
}
