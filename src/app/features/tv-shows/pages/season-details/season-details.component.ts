import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { map, switchMap, tap } from 'rxjs/operators';

import { CastGridComponent } from '../../../../shared/components/cast-grid/cast-grid.component';
import { EpisodeListItemComponent } from '../../../../shared/components/episode-list-item/episode-list-item.component';
import { ImageGridComponent } from '../../../../shared/components/image-grid/image-grid.component';
import { MediaHeroComponent } from '../../../../shared/components/media-hero/media-hero.component';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header.component';
import { VideoGridComponent } from '../../../../shared/components/video-grid/video-grid.component';
import { FadeInDirective } from '../../../../shared/directives/fade-in.directive';
import { MediaType } from '../../../../shared/enumerations/media-type.enum';
import { TvShowFacade } from '../../../../shared/facades/tv-show.facade';
import { TvShowDetails, TvShowEpisode, TvShowSeasonDetails } from '../../../../shared/models/tv-show.model';

@Component({
    selector: 'app-season-details',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        SectionHeaderComponent,
        EpisodeListItemComponent,
        MediaHeroComponent,
        CastGridComponent,
        ImageGridComponent,
        VideoGridComponent,
        FadeInDirective,
    ],
    templateUrl: './season-details.component.html',
    styleUrls: ['./season-details.component.scss'],
})
export class SeasonDetailsComponent implements OnInit {
    mediaType = MediaType;
    tvShowId!: number;
    seasonNumber!: number;
    tvShowDetails!: TvShowDetails;
    seasonDetails!: TvShowSeasonDetails;
    episodes: Array<TvShowEpisode> = [];
    isLoading = true;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly tvShowFacade: TvShowFacade,
        private readonly destroyRef: DestroyRef,
    ) {}

    ngOnInit(): void {
        this.loadDetails();
    }

    get skeletonArray(): Array<number> {
        return Array(6).fill(0);
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
                this.episodes = details.episodes;
                this.isLoading = false;
            });
    }

    trackByItemId(index: number, item: TvShowEpisode): number {
        return item.id;
    }

    trackByIndex(index: number): number {
        return index;
    }
}
