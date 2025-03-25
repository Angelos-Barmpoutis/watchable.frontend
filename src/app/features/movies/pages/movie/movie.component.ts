import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { environment } from '../../../../../environments/environment';
import { DEFAULT } from '../../../../shared/constants/defaults.constant';
import { BackdropPathDirective } from '../../../../shared/directives/backdrop-path.directive';
import { PosterPathDirective } from '../../../../shared/directives/poster-path.directive';
import { ProfilePathDirective } from '../../../../shared/directives/profile-path.directive';
import { BACKDROP_SIZE } from '../../../../shared/enumerations/backdrop-size.enum';
import { POSTER_SIZE } from '../../../../shared/enumerations/poster-size.enum';
import { PROFILE_SIZE } from '../../../../shared/enumerations/profile-size.enum';
import { MovieFacade } from '../../../../shared/facades/movie.facade';
import { getBackgroundImageUrl } from '../../../../shared/helpers/background-image-url';
import { MovieDetails } from '../../../../shared/models/movie.model';
import { Review } from '../../../../shared/models/review.model';
import { AvatarLetterPipe } from '../../../../shared/pipes/avatar-letter.pipe';
import { TimePipe } from '../../../../shared/pipes/time.pipe';

@Component({
    selector: 'app-movie',
    standalone: true,
    imports: [
        CommonModule,
        PosterPathDirective,
        BackdropPathDirective,
        ProfilePathDirective,
        TimePipe,
        AvatarLetterPipe,
    ],
    templateUrl: './movie.component.html',
    styleUrl: './movie.component.scss',
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MoviesMovieComponent implements OnInit {
    public movie!: MovieDetails;
    public reviews: Array<Review> = [];
    public profileSize = DEFAULT.mediumProfileSize;
    public posterSize = DEFAULT.largePosterSize;
    public posterFallback = DEFAULT.largePosterFallback;
    public backdropSize = DEFAULT.mediumBackdropSize;
    public bgBackdropSize = DEFAULT.largeBackdropSize;
    public bgBackdropFallback = DEFAULT.largeBackdropFallback;
    public imageBaseUrl = environment.imageBaseUrl;

    constructor(
        private movieSFacade: MovieFacade,
        private route: ActivatedRoute,
        private destroyRef: DestroyRef,
    ) {}

    ngOnInit(): void {
        const movieId = this.route.snapshot.paramMap.get('id');

        if (movieId) {
            this.movieSFacade
                .getDetails(+movieId)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe((movie) => {
                    console.log(movie);
                    this.movie = movie;
                    this.reviews = movie.reviews.results;
                });
        }
    }

    public getBackgroundImageUrl(backdropSize: BACKDROP_SIZE | PROFILE_SIZE | POSTER_SIZE, path: string): string {
        return getBackgroundImageUrl(backdropSize, path);
    }
}
