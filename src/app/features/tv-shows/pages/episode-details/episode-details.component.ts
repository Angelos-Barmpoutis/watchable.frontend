import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';

import { CrewGridComponent } from '../../../../shared/components/crew-grid/crew-grid.component';
import { EpisodeStillComponent } from '../../../../shared/components/episode-still/episode-still.component';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header.component';
import { MediaType } from '../../../../shared/enumerations/media-type.enum';
import { TvShowFacade } from '../../../../shared/facades/tv-show.facade';
import { TvShowDetails, TvShowEpisodeDetails } from '../../../../shared/models/tv-show.model';

@Component({
    selector: 'app-episode-details',
    standalone: true,
    imports: [CommonModule, SectionHeaderComponent, CrewGridComponent, EpisodeStillComponent],
    template: `
        <div class="wrapper">
            <div class="media-details-grid">
                <ng-container>
                    <div>
                        <section *ngIf="episodeDetails?.crew?.length || isLoading">
                            <header>
                                <app-section-header title="Crew" [isLoading]="isLoading"></app-section-header>
                            </header>
                            <app-crew-grid [crew]="episodeDetails?.crew ?? []" [isLoading]="isLoading"></app-crew-grid>
                        </section>

                        <section *ngIf="episodeDetails?.guest_stars?.length || isLoading">
                            <header>
                                <app-section-header title="Guest Stars" [isLoading]="isLoading"></app-section-header>
                            </header>
                            <app-crew-grid
                                [crew]="episodeDetails?.guest_stars ?? []"
                                [isLoading]="isLoading"
                            ></app-crew-grid>
                        </section>

                        <section *ngIf="episodeDetails?.still_path || isLoading">
                            <header>
                                <app-section-header title="Photos" [isLoading]="isLoading"></app-section-header>
                            </header>
                            <app-episode-still
                                [stillPath]="episodeDetails?.still_path"
                                [isLoading]="isLoading"
                            ></app-episode-still>
                        </section>
                    </div>
                </ng-container>

                <aside>
                    <section *ngIf="episodeDetails || isLoading">
                        <header>
                            <app-section-header title="Episode Info" [isLoading]="isLoading"></app-section-header>
                        </header>
                        <div class="episode-info">
                            <h3>{{ episodeDetails?.name }}</h3>
                            <p *ngIf="episodeDetails?.overview">{{ episodeDetails?.overview }}</p>
                            <div class="meta">
                                <span *ngIf="episodeDetails?.air_date">
                                    Air Date: {{ episodeDetails?.air_date | date: 'MMM d, y' }}
                                </span>
                                <span *ngIf="episodeDetails?.episode_number">
                                    Episode: {{ episodeDetails?.episode_number }}
                                </span>
                                <span *ngIf="episodeDetails?.vote_average">
                                    Rating: {{ episodeDetails?.vote_average | number: '1.1-1' }}/10
                                </span>
                            </div>
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    `,
    styles: [
        `
            .wrapper {
                padding: 2rem;
            }
            .media-details-grid {
                display: grid;
                grid-template-columns: 1fr 300px;
                gap: 2rem;
            }
            @media (max-width: 768px) {
                .media-details-grid {
                    grid-template-columns: 1fr;
                }
            }
            .episode-info {
                background-color: rgba(var(--color-surface-rgb), 0.6);
                backdrop-filter: blur(14px);
                border-radius: 0.5rem;
                padding: 1rem;

                h3 {
                    margin: 0 0 0.5rem;
                    font-size: 1.25rem;
                    font-weight: 600;
                }

                p {
                    margin: 0 0 1rem;
                    font-size: 0.875rem;
                    color: var(--color-text-secondary);
                }

                .meta {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    font-size: 0.875rem;
                    color: var(--color-text-secondary);

                    > span {
                        position: relative;
                        padding-left: 1rem;

                        &::before {
                            content: '•';
                            position: absolute;
                            left: 0;
                        }
                    }
                }
            }
        `,
    ],
})
export class EpisodeDetailsComponent implements OnInit {
    public mediaType = MediaType;
    public tvShowId!: number;
    public seasonNumber!: number;
    public episodeNumber!: number;
    public tvShowDetails!: TvShowDetails;
    public episodeDetails!: TvShowEpisodeDetails;
    public isLoading = true;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly tvShowFacade: TvShowFacade,
        private readonly destroyRef: DestroyRef,
    ) {}

    public ngOnInit(): void {
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
                    return this.tvShowFacade.getTvShowEpisodeDetails(tvShowId, seasonNumber, episodeNumber);
                }),
            )
            .subscribe((details) => {
                this.episodeDetails = details;
                this.isLoading = false;
            });
    }
}
