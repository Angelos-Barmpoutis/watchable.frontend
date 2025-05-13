import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap, tap } from 'rxjs/operators';

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

    constructor(
        private route: ActivatedRoute,
        private tvShowFacade: TvShowFacade,
        private destroyRef: DestroyRef,
    ) {}

    ngOnInit(): void {
        this.loadDetails();
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
