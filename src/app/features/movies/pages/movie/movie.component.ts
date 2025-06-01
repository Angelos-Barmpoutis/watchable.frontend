import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { EMPTY } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { ButtonType } from '../../../../shared/components/button/enumerations/button-type.enum';
import { ButtonLink } from '../../../../shared/components/button/models/button.model';
import { CarouselMediaComponent } from '../../../../shared/components/carousel-media/carousel-media.component';
import { CastGridComponent } from '../../../../shared/components/cast-grid/cast-grid.component';
import { ImageGridComponent } from '../../../../shared/components/image-grid/image-grid.component';
import { MediaDetailsComponent } from '../../../../shared/components/media-details/media-details.component';
import { MediaHeroComponent } from '../../../../shared/components/media-hero/media-hero.component';
import { ReviewGridComponent } from '../../../../shared/components/review-grid/review-grid.component';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header.component';
import { VideoGridComponent } from '../../../../shared/components/video-grid/video-grid.component';
import { FadeInDirective } from '../../../../shared/directives/fade-in.directive';
import { MediaType } from '../../../../shared/enumerations/media-type.enum';
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
        ReviewGridComponent,
        SectionHeaderComponent,
        VideoGridComponent,
        ButtonComponent,
        FadeInDirective,
    ],
    templateUrl: './movie.component.html',
    styleUrls: ['./movie.component.scss'],
})
export class MovieComponent implements OnInit {
    readonly mediaType = MediaType;
    movieId!: number;
    movieDetails: MovieDetails | undefined;
    isLoading = true;

    readonly ButtonType = ButtonType;

    constructor(
        private route: ActivatedRoute,
        private movieGateway: MovieGateway,
        private destroyRef: DestroyRef,
    ) {}

    ngOnInit(): void {
        this.loadMovieDetails();
    }

    get mediaLinks(): Array<ButtonLink> {
        return [
            { path: 'https://www.imdb.com/title/' + this.movieDetails?.external_ids?.imdb_id, isExternal: true },
            { path: 'https://www.facebook.com/' + this.movieDetails?.external_ids?.facebook_id, isExternal: true },
            { path: 'https://www.instagram.com/' + this.movieDetails?.external_ids?.instagram_id, isExternal: true },
            { path: 'https://www.twitter.com/' + this.movieDetails?.external_ids?.twitter_id, isExternal: true },
        ];
    }

    get isExternalIdAvailable(): boolean {
        return (
            !!this.movieDetails?.external_ids?.imdb_id ||
            !!this.movieDetails?.external_ids?.facebook_id ||
            !!this.movieDetails?.external_ids?.instagram_id ||
            !!this.movieDetails?.external_ids?.twitter_id
        );
    }

    private loadMovieDetails(): void {
        this.route.paramMap
            .pipe(
                tap(() => {
                    this.isLoading = true;
                }),
                takeUntilDestroyed(this.destroyRef),
                switchMap((params) => {
                    const id = Number(params.get('id'));
                    return id ? this.movieGateway.getDetails(id) : EMPTY;
                }),
            )
            .subscribe((movieDetails) => {
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
                    external_ids: {
                        imdb_id: movieDetails.external_ids?.imdb_id || null,
                        facebook_id: movieDetails.external_ids?.facebook_id || null,
                        instagram_id: movieDetails.external_ids?.instagram_id || null,
                        twitter_id: movieDetails.external_ids?.twitter_id || null,
                    },
                };
                this.isLoading = false;
            });
    }
}
