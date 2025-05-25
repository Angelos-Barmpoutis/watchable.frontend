import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { FadeInDirective } from '../../directives/fade-in.directive';
import { Review } from '../../models/review.model';
import { AvatarUrlPipe } from '../../pipes/avatar-url.pipe';
import { RatingBadgeComponent } from '../rating-badge/rating-badge.component';

@Component({
    selector: 'app-review-item',
    standalone: true,
    imports: [CommonModule, FadeInDirective, AvatarUrlPipe, RatingBadgeComponent],
    templateUrl: './review-item.component.html',
    styleUrls: ['./review-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewItemComponent {
    @Input({ required: true }) review!: Review;
    @Input() isLoading = false;
}
