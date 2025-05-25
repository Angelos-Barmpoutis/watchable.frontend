import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'app-rating-badge',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './rating-badge.component.html',
    styleUrls: ['./rating-badge.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RatingBadgeComponent {
    @Input() rating!: number;
    @Input() isLoading = false;
}
