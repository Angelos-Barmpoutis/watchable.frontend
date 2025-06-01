import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EMPTY } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { SeasonListItemComponent } from '../../../../../shared/components/season-list-item/season-list-item.component';
import { SectionHeaderComponent } from '../../../../../shared/components/section-header/section-header.component';
import { DEFAULT } from '../../../../../shared/constants/defaults.constant';
import { MediaType } from '../../../../../shared/enumerations/media-type.enum';
import { TvShowFacade } from '../../../../../shared/facades/tv-show.facade';
import { TvShowDetails, TvShowSeason } from '../../../../../shared/models/tv-show.model';

@Component({
    selector: 'app-seasons',
    standalone: true,
    imports: [CommonModule, RouterModule, SectionHeaderComponent, SeasonListItemComponent],
    templateUrl: './seasons.component.html',
    styleUrls: ['./seasons.component.scss'],
})
export class SeasonsComponent implements OnInit {
    mediaType = MediaType;
    tvShowId: number | undefined;
    tvShowDetails: TvShowDetails | undefined;
    seasons: Array<TvShowSeason> = [];
    isLoading = true;
    itemsPerPage = DEFAULT.itemsPerPage / 2;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly tvShowFacade: TvShowFacade,
        private readonly destroyRef: DestroyRef,
    ) {}

    ngOnInit(): void {
        this.loadDetails();
    }

    get skeletonArray(): Array<number> {
        return Array(this.itemsPerPage)
            .fill(0)
            .map((_, index) => index);
    }

    private loadDetails(): void {
        this.route.params
            .pipe(
                tap(() => {
                    this.isLoading = true;
                }),
                takeUntilDestroyed(this.destroyRef),
                map((params) => +params['id']),
                switchMap((id) => {
                    this.tvShowId = id;
                    return id ? this.tvShowFacade.getDetails(id) : EMPTY;
                }),
            )
            .subscribe((details) => {
                this.tvShowDetails = details;
                this.seasons = details.seasons;
                this.isLoading = false;
            });
    }

    trackByItemId(index: number, item: TvShowSeason): number {
        return item.id;
    }

    trackByIndex(index: number): number {
        return index;
    }
}
