import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SafeResourceUrl } from '@angular/platform-browser';
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
import { BACKDROP_SIZE } from '../../../../shared/enumerations/backdrop-size.enum';
import { MEDIA_TYPE } from '../../../../shared/enumerations/media-type.enum';
import { TvShowGateway } from '../../../../shared/gateways/tv-show.gateway';
import { filterMediaItems } from '../../../../shared/helpers/filter-items.helper';
import { TvShow, TvShowDetails } from '../../../../shared/models/tv-show.model';

@Component({
    selector: 'app-tv-show',
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
    templateUrl: './tv-show.component.html',
    styleUrls: ['./tv-show.component.scss'],
})
export class TvShowComponent implements OnInit {
    tvShowDetails!: TvShowDetails;
    isLoading = true;
    trailerUrl: SafeResourceUrl | null = null;
    readonly MEDIA_TYPE = MEDIA_TYPE;
    readonly BACKDROP_SIZE = BACKDROP_SIZE;

    constructor(
        private route: ActivatedRoute,
        private tvShowGateway: TvShowGateway,
        private destroyRef: DestroyRef,
    ) {}

    ngOnInit(): void {
        this.loadTvShowDetails();
    }

    private loadTvShowDetails(): void {
        this.route.paramMap
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                switchMap((params) => {
                    const id = Number(params.get('id'));
                    return id ? this.tvShowGateway.getDetails(id) : EMPTY;
                }),
            )
            .subscribe({
                next: (tvShowDetails) => {
                    this.tvShowDetails = {
                        ...tvShowDetails,
                        similar: {
                            ...tvShowDetails.similar,
                            results: filterMediaItems(tvShowDetails.similar.results) as Array<TvShow>,
                        },
                        recommendations: {
                            ...tvShowDetails.recommendations,
                            results: filterMediaItems(tvShowDetails.recommendations.results) as Array<TvShow>,
                        },
                    };
                    this.isLoading = false;
                },
            });
    }
}
