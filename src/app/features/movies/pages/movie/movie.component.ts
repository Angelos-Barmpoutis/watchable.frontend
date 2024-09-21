import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { YouTubePlayer } from '@angular/youtube-player';
import { takeUntil } from 'rxjs';

import { environment } from '../../../../../environments/environment';
import { BACKDROP_SIZE } from '../../../../core/enumerations/backdrop-size.enum';
import { POSTER_SIZE } from '../../../../core/enumerations/poster-size.enum';
import { PROFILE_SIZE } from '../../../../core/enumerations/profile-size.enum';
import { MovieDetails } from '../../../../core/models/movies/details.model';
import { Review } from '../../../../core/models/shared/review.model';
import { DEFAULT } from '../../../../shared/constants/defaults.constant';
import { BackdropPathDirective } from '../../../../shared/directives/backdrop-path.directive';
import { PosterPathDirective } from '../../../../shared/directives/poster-path.directive';
import { ProfilePathDirective } from '../../../../shared/directives/profile-path.directive';
import { MoviesFacade } from '../../../../shared/facades/movies.facade';
import { getBackgroundImageUrl } from '../../../../shared/helpers/background-image-url';
import { BaseComponent } from '../../../../shared/helpers/base.component';
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
        YouTubePlayer,
    ],
    templateUrl: './movie.component.html',
    styleUrl: './movie.component.scss',
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MoviesMovieComponent extends BaseComponent implements OnInit {
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
        private movieSFacade: MoviesFacade,
        private route: ActivatedRoute,
    ) {
        super();

        const movieId = this.route.snapshot.paramMap.get('id');

        if (movieId) {
            this.movieSFacade
                .getDetails(+movieId)
                .pipe(takeUntil(this.destroyed))
                .subscribe((movie) => {
                    console.log(movie);
                    this.movie = movie;

                    this.reviews = movie.reviews.results;
                });
        }
    }

    ngOnInit(): void {}

    public getBackgroundImageUrl(backdropSize: BACKDROP_SIZE | PROFILE_SIZE | POSTER_SIZE, path: string): string {
        return getBackgroundImageUrl(backdropSize, path);
    }
}
