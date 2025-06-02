import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { DEFAULT } from '../../constants/defaults.constant';
import { SnackbarType } from './enumerations/snacbar-type.enum';

@Component({
    standalone: true,
    selector: 'app-snackbar',
    imports: [CommonModule],
    templateUrl: './snackbar.component.html',
    styleUrls: ['./snackbar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SnackbarComponent {
    @Input() message = '';
    @Input() type: SnackbarType = SnackbarType.Success;
    @Input() duration = DEFAULT.snackbarDuration;
    @Input() show = false;
    @Output() dismiss = new EventEmitter<void>();

    get icon(): string {
        switch (this.type) {
            case SnackbarType.Success:
                return 'fas fa-check-circle';
            case SnackbarType.Error:
                return 'fas fa-times-circle';
            case SnackbarType.Warning:
                return 'fas fa-exclamation-circle';
            default:
                return 'fas fa-info-circle';
        }
    }

    onDismiss(): void {
        this.dismiss.emit();
    }
}
