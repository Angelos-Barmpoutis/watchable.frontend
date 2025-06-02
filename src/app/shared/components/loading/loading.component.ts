import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { FadeInDirective } from '../../directives/fade-in.directive';

@Component({
    standalone: true,
    selector: 'app-loading',
    imports: [CommonModule, FadeInDirective],
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent {
    @Input() message = 'Loading...';
    @Input() overlay = false;
}
