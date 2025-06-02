import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { EMPTY } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { ButtonType } from '../../../../shared/components/button/enumerations/button-type.enum';
import { ButtonLink } from '../../../../shared/components/button/models/button.model';
import { CarouselMediaComponent } from '../../../../shared/components/carousel-media/carousel-media.component';
import { CarouselSeasonComponent } from '../../../../shared/components/carousel-season/carousel-season.component';
import { CastGridComponent } from '../../../../shared/components/cast-grid/cast-grid.component';
import { ImageGridComponent } from '../../../../shared/components/image-grid/image-grid.component';
import { MediaDetailsComponent } from '../../../../shared/components/media-details/media-details.component';
import { MediaHeroComponent } from '../../../../shared/components/media-hero/media-hero.component';
import { ReviewGridComponent } from '../../../../shared/components/review-grid/review-grid.component';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header.component';
import { VideoGridComponent } from '../../../../shared/components/video-grid/video-grid.component';
import { FadeInDirective } from '../../../../shared/directives/fade-in.directive';
import { MediaType } from '../../../../shared/enumerations/media-type.enum';
import { TvShowFacade } from '../../../../shared/facades/tv-show.facade';
import { filterMediaItems } from '../../../../shared/helpers/filter-items.helper';
import { TvShow, TvShowDetails } from '../../../../shared/models/tv-show.model';

@Component({
    standalone: true,
    selector: 'app-tv-show',
    imports: [
        CommonModule,
        SectionHeaderComponent,
        MediaHeroComponent,
        MediaDetailsComponent,
        CarouselSeasonComponent,
        CarouselMediaComponent,
        CastGridComponent,
        ImageGridComponent,
        VideoGridComponent,
        ReviewGridComponent,
        ButtonComponent,
        FadeInDirective,
    ],
    templateUrl: './tv-show.component.html',
    styleUrls: ['./tv-show.component.scss'],
})
export class TvShowComponent implements OnInit {
    tvShowDetails: TvShowDetails | undefined;
    isLoading = true;
    trailerUrl: SafeResourceUrl | null = null;

    readonly ButtonType = ButtonType;
    readonly mediaType = MediaType;

    constructor(
        private route: ActivatedRoute,
        private tvShowFacade: TvShowFacade,
        private destroyRef: DestroyRef,
    ) {}

    ngOnInit(): void {
        this.loadTvShowDetails();
    }

    get mediaLinks(): Array<ButtonLink> {
        return [
            { path: 'https://www.imdb.com/title/' + this.tvShowDetails?.external_ids?.imdb_id, isExternal: true },
            { path: 'https://www.facebook.com/' + this.tvShowDetails?.external_ids?.facebook_id, isExternal: true },
            { path: 'https://www.instagram.com/' + this.tvShowDetails?.external_ids?.instagram_id, isExternal: true },
            { path: 'https://www.twitter.com/' + this.tvShowDetails?.external_ids?.twitter_id, isExternal: true },
        ];
    }

    get isExternalIdAvailable(): boolean {
        return (
            !!this.tvShowDetails?.external_ids?.imdb_id ||
            !!this.tvShowDetails?.external_ids?.facebook_id ||
            !!this.tvShowDetails?.external_ids?.instagram_id ||
            !!this.tvShowDetails?.external_ids?.twitter_id
        );
    }

    private loadTvShowDetails(): void {
        this.route.paramMap
            .pipe(
                tap(() => {
                    this.isLoading = true;
                }),
                takeUntilDestroyed(this.destroyRef),
                switchMap((params) => {
                    const id = Number(params.get('id'));
                    return id ? this.tvShowFacade.getDetails(id) : EMPTY;
                }),
            )
            .subscribe((tvShowDetails) => {
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
                    external_ids: {
                        imdb_id: tvShowDetails.external_ids?.imdb_id || null,
                        facebook_id: tvShowDetails.external_ids?.facebook_id || null,
                        instagram_id: tvShowDetails.external_ids?.instagram_id || null,
                        twitter_id: tvShowDetails.external_ids?.twitter_id || null,
                    },
                };
                this.isLoading = false;
            });
    }
}
