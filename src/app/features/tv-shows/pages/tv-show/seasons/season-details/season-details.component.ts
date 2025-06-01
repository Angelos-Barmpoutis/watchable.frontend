import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { map, switchMap, tap } from 'rxjs/operators';

import { ButtonComponent } from '../../../../../../shared/components/button/button.component';
import { ButtonType } from '../../../../../../shared/components/button/enumerations/button-type.enum';
import { ButtonLink } from '../../../../../../shared/components/button/models/button.model';
import { CastGridComponent } from '../../../../../../shared/components/cast-grid/cast-grid.component';
import { EpisodeGridComponent } from '../../../../../../shared/components/episode-grid/episode-grid.component';
import { ImageGridComponent } from '../../../../../../shared/components/image-grid/image-grid.component';
import { MediaHeroComponent } from '../../../../../../shared/components/media-hero/media-hero.component';
import { SeasonDetailsComponent } from '../../../../../../shared/components/season-details/season-details.component';
import { SectionHeaderComponent } from '../../../../../../shared/components/section-header/section-header.component';
import { VideoGridComponent } from '../../../../../../shared/components/video-grid/video-grid.component';
import { FadeInDirective } from '../../../../../../shared/directives/fade-in.directive';
import { AspectRatio } from '../../../../../../shared/enumerations/aspect-ratio.enum';
import { MediaType } from '../../../../../../shared/enumerations/media-type.enum';
import { TvShowFacade } from '../../../../../../shared/facades/tv-show.facade';
import { TvShowDetails, TvShowEpisode, TvShowSeasonDetails } from '../../../../../../shared/models/tv-show.model';

@Component({
    standalone: true,
    selector: 'app-season-details-page',
    imports: [
        CommonModule,
        RouterModule,
        SectionHeaderComponent,
        CastGridComponent,
        FadeInDirective,
        MediaHeroComponent,
        ImageGridComponent,
        VideoGridComponent,
        EpisodeGridComponent,
        SeasonDetailsComponent,
        ButtonComponent,
    ],
    templateUrl: './season-details.component.html',
    styleUrl: './season-details.component.scss'
})
export class SeasonDetailsPageComponent implements OnInit {
    mediaType = MediaType;
    tvShowId: number | undefined;
    seasonNumber: number | undefined;
    tvShowDetails: TvShowDetails | undefined;
    seasonDetails: TvShowSeasonDetails | undefined;
    episodes: Array<TvShowEpisode> = [];
    isLoading = true;
    readonly aspectRatio = AspectRatio;
    readonly buttonType = ButtonType;

    constructor(
        private route: ActivatedRoute,
        private tvShowFacade: TvShowFacade,
        private destroyRef: DestroyRef,
    ) {}

    ngOnInit(): void {
        this.loadDetails();
    }

    get mediaLinks(): Array<ButtonLink> {
        return [
            { path: 'https://www.imdb.com/title/' + this.seasonDetails?.external_ids?.imdb_id, isExternal: true },
            { path: 'https://www.facebook.com/' + this.seasonDetails?.external_ids?.facebook_id, isExternal: true },
            { path: 'https://www.instagram.com/' + this.seasonDetails?.external_ids?.instagram_id, isExternal: true },
            { path: 'https://www.twitter.com/' + this.seasonDetails?.external_ids?.twitter_id, isExternal: true },
        ];
    }

    get isExternalIdAvailable(): boolean {
        return (
            !!this.seasonDetails?.external_ids?.imdb_id ||
            !!this.seasonDetails?.external_ids?.facebook_id ||
            !!this.seasonDetails?.external_ids?.instagram_id ||
            !!this.seasonDetails?.external_ids?.twitter_id
        );
    }

    private loadDetails(): void {
        this.route.params
            .pipe(
                tap(() => {
                    this.isLoading = true;
                }),
                takeUntilDestroyed(this.destroyRef),
                map((params) => ({
                    tvShowId: +params['id'],
                    seasonNumber: +params['seasonNumber'],
                })),
                switchMap(({ tvShowId, seasonNumber }) => {
                    this.tvShowId = tvShowId;
                    this.seasonNumber = seasonNumber;
                    return this.tvShowFacade.getDetails(tvShowId).pipe(
                        tap((tvShowDetails) => {
                            this.tvShowDetails = tvShowDetails;
                        }),
                        switchMap(() => this.tvShowFacade.getTvShowSeasonDetails(tvShowId, seasonNumber)),
                    );
                }),
            )
            .subscribe((details) => {
                this.seasonDetails = details;
                this.episodes = details.episodes ?? [];
                this.isLoading = false;
            });
    }
}
