import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { DEFAULT } from '../../constants/defaults.constant';
import { FadeInDirective } from '../../directives/fade-in.directive';

export type SnackbarType = 'success' | 'error' | 'info' | 'warning';

@Component({
    selector: 'app-snackbar',
    standalone: true,
    imports: [CommonModule, FadeInDirective],
    templateUrl: './snackbar.component.html',
    styleUrls: ['./snackbar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SnackbarComponent {
    @Input() message = '';
    @Input() type: SnackbarType = DEFAULT.snackbarType;
    @Input() duration = DEFAULT.snackbarDuration;
    @Input() show = false;

    get icon(): string {
        switch (this.type) {
            case 'success':
                return 'fas fa-check-circle';
            case 'error':
                return 'fas fa-times-circle';
            case 'warning':
                return 'fas fa-exclamation-circle';
            default:
                return 'fas fa-info-circle';
        }
    }
}
