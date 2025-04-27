import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { DEFAULT } from '../../constants/defaults.constant';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { ButtonType } from '../../enumerations/components/button-type.enum';
import { Review } from '../../models/review.model';
import { ButtonComponent } from '../button/button.component';
import { ReviewItemComponent } from '../review-item/review-item.component';

@Component({
    selector: 'app-review-grid',
    standalone: true,
    imports: [CommonModule, FadeInDirective, ReviewItemComponent, ButtonComponent],
    templateUrl: './review-grid.component.html',
    styleUrls: ['./review-grid.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewGridComponent {
    @Input() reviews: Array<Review> = [];
    @Input() isLoading = false;

    readonly default = DEFAULT;
    readonly ButtonType = ButtonType;

    showAll = false;

    readonly defaultReview: Review = {
        author: '',
        author_details: {
            name: '',
            username: '',
            avatar_path: '',
            rating: 0,
        },
        content: '',
        created_at: '',
        id: '',
        updated_at: '',
        url: '',
    };

    get hasMoreReviews(): boolean {
        return this.reviews.length > DEFAULT.castCount;
    }

    get skeletonArray(): Array<number> {
        return Array(DEFAULT.reviewsCount)
            .fill(0)
            .map((_, index) => index + 1);
    }

    toggleShowAll(): void {
        this.showAll = !this.showAll;
    }
}
