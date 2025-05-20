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

    readonly state$ = this.state.asObservable();

    show(message: string, type: SnackbarType = 'info', duration: number = this.defaultDuration): void {
        this.state.next({ message, type, show: true });

        setTimeout(() => {
            this.hide();
        }, duration);
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
