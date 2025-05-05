// src/app/features/discover/movie-discover/movie-discover.component.ts
import { CommonModule } from '@angular/common';
import { Component, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { BaseDiscoverComponent } from '../../../../shared/abstract/base-discover.abstract';
import { InfiniteScrollLoaderComponent } from '../../../../shared/components/infinite-scroll-loader/infinite-scroll-loader.component';
import { MediaListItemComponent } from '../../../../shared/components/media-list-item/media-list-item.component';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header.component';
import { MediaType } from '../../../../shared/enumerations/media-type.enum';
import { TvShowFacade } from '../../../../shared/facades/tv-show.facade';
import { mapTvShowsWithGenres } from '../../../../shared/helpers/genres.helper';
import { TvShowItem } from '../../../../shared/models/tv-show.model';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';

@Component({
    selector: 'app-discover-tv-shows',
    standalone: true,
    templateUrl: './discover.component.html',
    styleUrl: './discover.component.scss',
    imports: [CommonModule, SectionHeaderComponent, InfiniteScrollLoaderComponent, MediaListItemComponent],
})
export class DiscoverTvShowsComponent extends BaseDiscoverComponent<TvShowItem> {
    protected override genreStorageKey = 'tvShowGenres';
    mediaType = MediaType;

    constructor(
        private tvShowFacade: TvShowFacade,
        route: ActivatedRoute,
        localStorageService: LocalStorageService,
        destroyRef: DestroyRef,
    ) {
        super(route, localStorageService, destroyRef);
    }

    trackByItemId(index: number, item: TvShowItem): number {
        return item.id;
    }

    getItems(): void {
        this.isLoading = true;
        this.tvShowFacade
            .getTvShows(this.currentPage, this.genreId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(({ results, page, total_pages }) => {
                const tvShowsWithGenres = mapTvShowsWithGenres(results, this.genres);
                this.items = [...this.items, ...tvShowsWithGenres];
                this.currentPage = page;
                this.totalPages = total_pages;
                this.isLoading = false;
            });
    }
}
