import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'app-loading',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent {
    @Input() message = 'Loading...';
    @Input() overlay = false;
}
