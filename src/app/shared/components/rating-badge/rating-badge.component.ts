import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-rating-badge',
    imports: [CommonModule],
    templateUrl: './rating-badge.component.html',
    styleUrls: ['./rating-badge.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RatingBadgeComponent {
    @Input() rating!: number;
    @Input() isLoading = false;
}
