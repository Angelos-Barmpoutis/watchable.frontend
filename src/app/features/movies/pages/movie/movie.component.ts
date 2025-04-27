import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { EMPTY } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { CarouselMediaComponent } from '../../../../shared/components/carousel-media/carousel-media.component';
import { CastGridComponent } from '../../../../shared/components/cast-grid/cast-grid.component';
import { ImageGridComponent } from '../../../../shared/components/image-grid/image-grid.component';
import { MediaDetailsComponent } from '../../../../shared/components/media-details/media-details.component';
import { MediaHeroComponent } from '../../../../shared/components/media-hero/media-hero.component';
import { ReviewGridComponent } from '../../../../shared/components/review-grid/review-grid.component';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header.component';
import { VideoGridComponent } from '../../../../shared/components/video-grid/video-grid.component';
import { ButtonType } from '../../../../shared/enumerations/components/button-type.enum';
import { MEDIA_TYPE } from '../../../../shared/enumerations/media-type.enum';
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
    ],
    templateUrl: './movie.component.html',
    styleUrls: ['./movie.component.scss'],
})
export class MovieComponent implements OnInit {
    readonly mediaType = MEDIA_TYPE;
    movieId!: number;
    movieDetails!: MovieDetails;
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
                };
                this.isLoading = false;
            });
    }
}
