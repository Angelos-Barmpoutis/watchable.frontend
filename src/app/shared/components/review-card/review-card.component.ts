import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { FadeInDirective } from '../../directives/fade-in.directive';
import { Review } from '../../models/review.model';
import { AvatarUrlPipe } from '../../pipes/avatar-url.pipe';

@Component({
    selector: 'app-review-card',
    standalone: true,
    imports: [CommonModule, FadeInDirective, AvatarUrlPipe],
    templateUrl: './review-card.component.html',
    styleUrls: ['./review-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewCardComponent {
    @Input({ required: true }) review!: Review;
    @Input() isLoading = false;
}
