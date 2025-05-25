import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    DestroyRef,
    Input,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin, map, of, switchMap, tap } from 'rxjs';

import { FadeInDirective } from '../../directives/fade-in.directive';
import { AccountFacade } from '../../facades/account.facade';
import { TvShowFacade } from '../../facades/tv-show.facade';
import { TvShowEpisodeDetails } from '../../models/tv-show.model';
import { FormatNumberWithKPipe } from '../../pipes/format-number.pipe';
import { TimePipe } from '../../pipes/time.pipe';
import { AuthService } from '../../services/auth.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
    selector: 'app-episode-details',
    standalone: true,
    imports: [CommonModule, FadeInDirective, TimePipe, FormatNumberWithKPipe],
    templateUrl: './episode-details.component.html',
    styleUrl: './episode-details.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EpisodeDetailsComponent implements OnChanges {
    @Input() episodeDetails!: TvShowEpisodeDetails;
    @Input() isLoading = true;
    @Input() tvShowId!: number;
    userRating?: number;

    constructor(
        private readonly tvShowFacade: TvShowFacade,
        private readonly accountFacade: AccountFacade,
        private readonly authService: AuthService,
        private readonly snackbarService: SnackbarService,
        private readonly destroyRef: DestroyRef,
        private readonly cdr: ChangeDetectorRef,
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['episodeDetails'] && this.episodeDetails) {
            this.getUserRating();
        }
    }

    get skeletonArray(): Array<number> {
        return Array(7)
            .fill(0)
            .map((_, index) => index);
    }

    get stars(): Array<number> {
        return Array(5)
            .fill(0)
            .map((_, index) => index + 1);
    }

    private getUserRating(): void {
        this.authService.userInfo$
            .pipe(
                tap(() => {
                    this.isLoading = true;
                    this.cdr.detectChanges();
                }),
                takeUntilDestroyed(this.destroyRef),
                switchMap((userInfo) => {
                    // First get the first page to know total pages
                    return this.accountFacade.getRatedTvShowEpisodes(userInfo?.id ?? 0, 1).pipe(
                        switchMap((firstPage) => {
                            if (!firstPage || firstPage.total_pages <= 1) {
                                return of(firstPage);
                            }

                            // Create an array of observables for all pages
                            const pageRequests = Array.from({ length: firstPage.total_pages - 1 }, (_, i) =>
                                this.accountFacade.getRatedTvShowEpisodes(userInfo?.id ?? 0, i + 2),
                            );

                            // Combine all pages
                            return forkJoin([of(firstPage), ...pageRequests]).pipe(
                                map((pages) => ({
                                    ...firstPage,
                                    results: pages.flatMap((page) => page.results),
                                })),
                            );
                        }),
                    );
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe({
                next: (rated) => {
                    if (rated) {
                        const ratedItem = rated.results.find(
                            (item: { id: number }) => item.id === this.episodeDetails?.id,
                        );

                        this.userRating = ratedItem?.rating;
                        this.isLoading = false;
                        this.cdr.detectChanges();
                    }
                },
                error: () => {
                    this.snackbarService.error('Failed to check rating status');
                },
            });
    }

    rateEpisode(rating: number): void {
        if (!this.authService.isAuthenticated()) {
            this.snackbarService.warning('Please sign in to rate items');
            return;
        }

        const previousRating = this.userRating;
        this.userRating = rating;
        this.cdr.detectChanges();

        const request = { value: rating };

        this.tvShowFacade
            .addTvShowEpisodeRating(
                this.tvShowId,
                this.episodeDetails.season_number,
                this.episodeDetails.episode_number,
                request,
            )
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    if (response.status_code !== 1 && response.status_code !== 13 && response.status_code !== 12) {
                        this.userRating = previousRating;
                        this.cdr.detectChanges();
                        this.snackbarService.error('Failed to update rating');
                    } else {
                        this.snackbarService.success('Rating updated');
                    }
                },
                error: () => {
                    this.userRating = previousRating;
                    this.cdr.detectChanges();
                    this.snackbarService.error('Failed to update rating');
                },
            });
    }
}
