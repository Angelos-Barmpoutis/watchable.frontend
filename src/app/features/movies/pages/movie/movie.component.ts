import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { EMPTY } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { CarouselMediaComponent } from '../../../../shared/components/carousel-media/carousel-media.component';
import { CastGridComponent } from '../../../../shared/components/cast-grid/cast-grid.component';
import { ImageGridComponent } from '../../../../shared/components/image-grid/image-grid.component';
import { MediaDetailsComponent } from '../../../../shared/components/media-details/media-details.component';
import { MediaHeroComponent } from '../../../../shared/components/media-hero/media-hero.component';
import { ReviewsComponent } from '../../../../shared/components/reviews/reviews.component';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header.component';
import { VideoGridComponent } from '../../../../shared/components/video-grid/video-grid.component';
import { DEFAULT } from '../../../../shared/constants/defaults.constant';
import { BACKDROP_SIZE } from '../../../../shared/enumerations/backdrop-size.enum';
import { MEDIA_TYPE } from '../../../../shared/enumerations/media-type.enum';
import { POSTER_SIZE } from '../../../../shared/enumerations/poster-size.enum';
import { PROFILE_SIZE } from '../../../../shared/enumerations/profile-size.enum';
import { MovieGateway } from '../../../../shared/gateways/movie.gateway';
import { filterMediaItems } from '../../../../shared/helpers/filter-items.helper';
import { Movie, MovieDetails } from '../../../../shared/models/movie.model';

@Component({
    selector: 'app-movie',
    standalone: true,
    imports: [
        CommonModule,
        CarouselMediaComponent,
        CastGridComponent,
        ImageGridComponent,
        MediaDetailsComponent,
        MediaHeroComponent,
        ReviewsComponent,
        SectionHeaderComponent,
        VideoGridComponent,
    ],
    templateUrl: './movie.component.html',
    styleUrls: ['./movie.component.scss'],
})
export class MovieComponent implements OnInit {
    readonly MEDIA_TYPE = MEDIA_TYPE;
    readonly POSTER_SIZE = POSTER_SIZE;
    readonly BACKDROP_SIZE = BACKDROP_SIZE;
    readonly PROFILE_SIZE = PROFILE_SIZE;
    readonly DEFAULT = DEFAULT;
    movieId!: number;
    movieDetails!: MovieDetails;
    isLoading = true;

    constructor(
        private route: ActivatedRoute,
        private movieGateway: MovieGateway,
        private destroyRef: DestroyRef,
    ) {}

    ngOnInit(): void {
        this.loadMovieDetails();
    }

    private loadMovieDetails(): void {
        this.route.paramMap
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                switchMap((params) => {
                    const id = Number(params.get('id'));
                    return id ? this.movieGateway.getDetails(id) : EMPTY;
                }),
            )
            .subscribe({
                next: (movieDetails) => {
                    this.movieDetails = {
                        ...movieDetails,
                        similar: {
                            ...movieDetails.similar,
                            results: filterMediaItems(movieDetails.similar.results) as Array<Movie>,
                        },
                        recommendations: {
                            ...movieDetails.recommendations,
                            results: filterMediaItems(movieDetails.recommendations.results) as Array<Movie>,
                        },
                    };
                    this.isLoading = false;
                },
            });
    }
}
