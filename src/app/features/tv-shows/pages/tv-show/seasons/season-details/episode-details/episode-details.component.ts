import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap, tap } from 'rxjs/operators';

import { ButtonComponent } from '../../../../../../../shared/components/button/button.component';
import { ButtonType } from '../../../../../../../shared/components/button/enumerations/button-type.enum';
import { ButtonLink } from '../../../../../../../shared/components/button/models/button.model';
import { CastGridComponent } from '../../../../../../../shared/components/cast-grid/cast-grid.component';
import { EpisodeDetailsComponent } from '../../../../../../../shared/components/episode-details/episode-details.component';
import { ImageGridComponent } from '../../../../../../../shared/components/image-grid/image-grid.component';
import { MediaHeroComponent } from '../../../../../../../shared/components/media-hero/media-hero.component';
import { SectionHeaderComponent } from '../../../../../../../shared/components/section-header/section-header.component';
import { VideoGridComponent } from '../../../../../../../shared/components/video-grid/video-grid.component';
import { FadeInDirective } from '../../../../../../../shared/directives/fade-in.directive';
import { AspectRatio } from '../../../../../../../shared/enumerations/aspect-ratio.enum';
import { MediaType } from '../../../../../../../shared/enumerations/media-type.enum';
import { TvShowFacade } from '../../../../../../../shared/facades/tv-show.facade';
import { MediaCreditsCastPerson } from '../../../../../../../shared/models/media.model';
import { TvShowDetails, TvShowEpisodeDetails } from '../../../../../../../shared/models/tv-show.model';

@Component({
    selector: 'app-episode-details-page',
    standalone: true,
    imports: [
        CommonModule,
        SectionHeaderComponent,
        CastGridComponent,
        FadeInDirective,
        MediaHeroComponent,
        ImageGridComponent,
        VideoGridComponent,
        EpisodeDetailsComponent,
        ButtonComponent,
    ],
    templateUrl: './episode-details.component.html',
    styleUrl: './episode-details.component.scss',
})
export class EpisodeDetailsPageComponent implements OnInit {
    mediaType = MediaType;
    tvShowId!: number;
    seasonNumber!: number;
    episodeNumber!: number;
    tvShowDetails!: TvShowDetails;
    episodeDetails!: TvShowEpisodeDetails;
    isLoading = true;
    transformedCrew: Array<MediaCreditsCastPerson> = [];
    cast: Array<MediaCreditsCastPerson> = [];
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
            { path: 'https://www.imdb.com/title/' + this.episodeDetails?.external_ids?.imdb_id, isExternal: true },
            { path: 'https://www.facebook.com/' + this.episodeDetails?.external_ids?.facebook_id, isExternal: true },
            { path: 'https://www.instagram.com/' + this.episodeDetails?.external_ids?.instagram_id, isExternal: true },
            { path: 'https://www.twitter.com/' + this.episodeDetails?.external_ids?.twitter_id, isExternal: true },
        ];
    }

    get isExternalIdAvailable(): boolean {
        return (
            !!this.episodeDetails?.external_ids?.imdb_id ||
            !!this.episodeDetails?.external_ids?.facebook_id ||
            !!this.episodeDetails?.external_ids?.instagram_id ||
            !!this.episodeDetails?.external_ids?.twitter_id
        );
    }

    private loadDetails(): void {
        this.route.params
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                map((params) => ({
                    tvShowId: +params['id'],
                    seasonNumber: +params['seasonNumber'],
                    episodeNumber: +params['episodeNumber'],
                })),
                switchMap(({ tvShowId, seasonNumber, episodeNumber }) => {
                    this.tvShowId = tvShowId;
                    this.seasonNumber = seasonNumber;
                    this.episodeNumber = episodeNumber;
                    return this.tvShowFacade.getDetails(tvShowId).pipe(
                        tap((tvShowDetails) => {
                            this.tvShowDetails = tvShowDetails;
                        }),
                        switchMap(() =>
                            this.tvShowFacade.getTvShowEpisodeDetails(tvShowId, seasonNumber, episodeNumber),
                        ),
                    );
                }),
            )
            .subscribe((details) => {
                this.episodeDetails = details;
                this.transformedCrew =
                    details.crew?.map((crew) => ({
                        ...crew,
                        character: crew.job,
                        order: 0,
                    })) ?? [];

                this.cast = details.credits?.cast ?? [];

                this.isLoading = false;
            });
    }
}
